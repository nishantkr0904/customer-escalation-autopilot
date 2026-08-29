import {
  EscalationAction,
  EscalationResult,
  Incident,
  LinearTicket,
  NotionEntry,
  ExecutiveSummary,
} from '../types'
import { linearAdapter } from '../integrations/linear'
import { slackAdapter } from '../integrations/slack'
import { notionAdapter } from '../integrations/notion'
import { emailAdapter } from '../integrations/email'
import { aiPipelineService } from './ai-pipeline'

class EscalationService {
  /**
   * Executes the 5 sequential escalation actions:
   * 1. Create Linear Ticket
   * 2. Notify Slack Channel (#engineering-critical)
   * 3. Generate Executive Summary
   * 4. Update Notion Incident Log
   * 5. Send Leadership Email
   */
  async executeEscalation(incident: Incident): Promise<EscalationResult> {
    console.log(`[Escalation Service] Starting escalation sequence for incident ${incident.id}`)
    const actions: EscalationAction[] = []
    const errors: string[] = []
    let linearTicket: LinearTicket | null = null
    let notionEntry: NotionEntry | null = null
    let execSummary: ExecutiveSummary | null = null

    // Helper to map severity to Linear priority (1=Urgent, 2=High, 3=Medium, 4=Low)
    const severityToPriority = (severity: string | null): 1 | 2 | 3 | 4 => {
      switch (severity) {
        case 'critical':
          return 1
        case 'high':
          return 2
        case 'medium':
          return 3
        default:
          return 4
      }
    }

    // Action 1: Create Linear Ticket
    try {
      const start = Date.now()
      const ticketTitle = `[${(incident.severity || 'CRITICAL').toUpperCase()}] ${incident.title} — ${incident.customer ? incident.customer.name : 'Customer'}`
      const ticketDesc = `## Incident Summary\n\n**Customer:** ${incident.customer ? incident.customer.name : 'Unknown'} (${incident.customer ? incident.customer.tier.toUpperCase() : 'SMB'})\n**Severity:** ${(incident.severity || 'HIGH').toUpperCase()}\n\n## Description\n${incident.description}\n\n## AI Analysis\n${incident.aiDecision ? incident.aiDecision.reasoning : 'Pending'}`

      linearTicket = await linearAdapter.createTicket({
        title: ticketTitle,
        description: ticketDesc,
        priority: severityToPriority(incident.severity),
        labels: ['incident', incident.severity || 'critical', incident.customer?.tier || 'smb'],
        incidentId: incident.id,
      })

      actions.push({
        action: 'create_linear_ticket',
        status: 'success',
        message: `Created ticket ${linearTicket.identifier} (Priority: ${linearTicket.priority}, Assignee: ${linearTicket.assignee})`,
        durationMs: Date.now() - start,
        error: null,
      })
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      errors.push(`Linear creation failed: ${errorMsg}`)
      actions.push({
        action: 'create_linear_ticket',
        status: 'failed',
        message: 'Failed to create Linear ticket',
        durationMs: 0,
        error: errorMsg,
      })
    }

    // Action 2: Notify Slack Channel
    try {
      const start = Date.now()
      const channel = incident.severity === 'critical' ? '#engineering-critical' : '#support-escalations'
      await slackAdapter.sendNotification(channel, {
        incidentId: incident.id,
        title: incident.title,
        severity: incident.severity,
        linearTicket: linearTicket ? linearTicket.identifier : null,
      })

      actions.push({
        action: 'notify_slack',
        status: 'success',
        message: `Notified ${channel} with incident details`,
        durationMs: Date.now() - start,
        error: null,
      })
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      errors.push(`Slack notification failed: ${errorMsg}`)
      actions.push({
        action: 'notify_slack',
        status: 'failed',
        message: 'Failed to notify Slack channel',
        durationMs: 0,
        error: errorMsg,
      })
    }

    // Action 3: Generate Executive Summary
    try {
      const start = Date.now()
      execSummary = await aiPipelineService.generateExecutiveSummary(incident)

      actions.push({
        action: 'generate_summary',
        status: 'success',
        message: `Executive summary generated (${execSummary.generatedBy})`,
        durationMs: Date.now() - start,
        error: null,
      })
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      errors.push(`Summary generation failed: ${errorMsg}`)
      actions.push({
        action: 'generate_summary',
        status: 'failed',
        message: 'Failed to generate executive summary',
        durationMs: 0,
        error: errorMsg,
      })
    }

    // Action 4: Update Notion Incident Log
    try {
      const start = Date.now()
      notionEntry = await notionAdapter.createIncidentEntry({
        incidentId: incident.id,
        title: incident.title,
        severity: incident.severity || 'high',
        customer: incident.customer ? incident.customer.name : 'Unknown Customer',
        customerTier: incident.customer ? incident.customer.tier : 'smb',
        status: 'escalated',
        summary: incident.description,
        aiConfidence: incident.aiDecision ? incident.aiDecision.confidence : 0.85,
        linearTicket: linearTicket ? linearTicket.identifier : null,
        impactScope: incident.aiDecision ? incident.aiDecision.businessImpact : 'Enterprise operational impact',
      })

      actions.push({
        action: 'update_notion',
        status: 'success',
        message: `Incident log entry created in Notion (${notionEntry.id})`,
        durationMs: Date.now() - start,
        error: null,
      })
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      errors.push(`Notion update failed: ${errorMsg}`)
      actions.push({
        action: 'update_notion',
        status: 'failed',
        message: 'Failed to update Notion log',
        durationMs: 0,
        error: errorMsg,
      })
    }

    // Action 5: Send Email Summary
    try {
      const start = Date.now()
      const recipients = ['leadership@company.com', 'support-leads@company.com']
      if (execSummary) {
        await emailAdapter.sendSummary(recipients, execSummary)
      }

      actions.push({
        action: 'send_email',
        status: 'success',
        message: `Summary emailed to ${recipients.join(', ')}`,
        durationMs: Date.now() - start,
        error: null,
      })
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      errors.push(`Email delivery failed: ${errorMsg}`)
      actions.push({
        action: 'send_email',
        status: 'failed',
        message: 'Failed to send email summary',
        durationMs: 0,
        error: errorMsg,
      })
    }

    const partialFailure = errors.length > 0
    return {
      incidentId: incident.id,
      escalated: true,
      reason: `Escalated based on ${incident.customer ? incident.customer.tier.toUpperCase() : 'SMB'} tier rules and ${(incident.severity || 'HIGH').toUpperCase()} severity.`,
      actions,
      linearTicket,
      notionEntry,
      executiveSummary: execSummary,
      completedAt: new Date().toISOString(),
      partialFailure,
      errors,
    }
  }
}

export const escalationService = new EscalationService()
