import preseededIncidents from '../mock-data/incidents.json'
import {
  CreateIncidentInput,
  Incident,
  SlackEvent,
  TimelineEvent,
  WorkflowState,
  WorkflowStep,
} from '../types'
import { generateId } from '../utils/formatters'
import { hubspotAdapter } from '../integrations/hubspot'
import { stripeAdapter } from '../integrations/stripe'
import { githubAdapter } from '../integrations/github'
import { aiPipelineService } from './ai-pipeline'
import { triageService } from './triage'
import { escalationService } from './escalation'

// Development global store persistence
declare global {
  // eslint-disable-next-line no-var
  var __incidentStore: Map<string, Incident> | undefined
}

class OrchestratorService {
  private store: Map<string, Incident>

  constructor() {
    if (globalThis.__incidentStore) {
      this.store = globalThis.__incidentStore
    } else {
      this.store = new Map<string, Incident>()
      // Pre-seed mock incidents into memory
      for (const inc of preseededIncidents as Incident[]) {
        this.store.set(inc.id, inc)
      }
      globalThis.__incidentStore = this.store
    }
  }

  /**
   * Initializes standard 10 workflow steps for an incident
   */
  private createInitialWorkflowState(incidentId: string): WorkflowState {
    const steps: WorkflowStep[] = [
      {
        id: 'parse_event',
        name: 'Parse Event',
        description: 'Extract customer email and description from intake payload',
        status: 'pending',
        startedAt: null,
        completedAt: null,
        durationMs: null,
        output: null,
        error: null,
        icon: '💬',
      },
      {
        id: 'fetch_customer',
        name: 'Retrieve Customer',
        description: 'Look up customer tier and ACV from HubSpot CRM',
        status: 'pending',
        startedAt: null,
        completedAt: null,
        durationMs: null,
        output: null,
        error: null,
        icon: '👤',
      },
      {
        id: 'fetch_billing',
        name: 'Retrieve Billing',
        description: 'Look up subscription status and MRR from Stripe',
        status: 'pending',
        startedAt: null,
        completedAt: null,
        durationMs: null,
        output: null,
        error: null,
        icon: '💳',
      },
      {
        id: 'fetch_issues',
        name: 'Retrieve Issues',
        description: 'Search for matching engineering issues in GitHub',
        status: 'pending',
        startedAt: null,
        completedAt: null,
        durationMs: null,
        output: null,
        error: null,
        icon: '🔧',
      },
      {
        id: 'ai_analysis',
        name: 'AI Analysis',
        description: 'Gemini 3.7 Flash severity and impact analysis',
        status: 'pending',
        startedAt: null,
        completedAt: null,
        durationMs: null,
        output: null,
        error: null,
        icon: '🤖',
      },
      {
        id: 'create_ticket',
        name: 'Create Linear Ticket',
        description: 'Create engineering ticket in Linear',
        status: 'pending',
        startedAt: null,
        completedAt: null,
        durationMs: null,
        output: null,
        error: null,
        icon: '🎫',
      },
      {
        id: 'notify_slack',
        name: 'Notify Engineering',
        description: 'Post alert to engineering Slack channel',
        status: 'pending',
        startedAt: null,
        completedAt: null,
        durationMs: null,
        output: null,
        error: null,
        icon: '📢',
      },
      {
        id: 'generate_summary',
        name: 'Generate Summary',
        description: 'Generate executive summary for stakeholders',
        status: 'pending',
        startedAt: null,
        completedAt: null,
        durationMs: null,
        output: null,
        error: null,
        icon: '📋',
      },
      {
        id: 'update_notion',
        name: 'Update Notion',
        description: 'Create entry in Notion incident log',
        status: 'pending',
        startedAt: null,
        completedAt: null,
        durationMs: null,
        output: null,
        error: null,
        icon: '📓',
      },
      {
        id: 'send_email',
        name: 'Send Email',
        description: 'Distribute summary email to leadership',
        status: 'pending',
        startedAt: null,
        completedAt: null,
        durationMs: null,
        output: null,
        error: null,
        icon: '📧',
      },
    ]

    return {
      incidentId,
      currentStep: 'parse_event',
      steps,
      startedAt: new Date().toISOString(),
      completedAt: null,
      totalDurationMs: null,
      overallStatus: 'running',
    }
  }

  /**
   * Main pipeline engine: receives intake input or Slack event and processes through all 10 steps.
   */
  async processIncident(input: CreateIncidentInput | SlackEvent): Promise<Incident> {
    const isSlack = 'eventId' in input
    const customerEmail = isSlack ? input.customerEmail : input.customerEmail
    const description = isSlack ? input.text : input.description
    const source = isSlack ? 'slack' : input.source

    const incidentId = generateId('inc')
    const now = new Date().toISOString()

    const timeline: TimelineEvent[] = [
      {
        id: generateId('evt'),
        timestamp: now,
        type: 'incident_created',
        title: 'Incident Received',
        description: `Incident received from ${source.toUpperCase()} (${customerEmail})`,
        status: 'success',
      },
    ]

    let incident: Incident = {
      id: incidentId,
      title: description.length > 60 ? description.slice(0, 60) + '...' : description,
      description,
      source,
      status: 'received',
      severity: null,
      customerEmail,
      customer: null,
      billing: null,
      relatedIssues: [],
      aiDecision: null,
      escalation: null,
      executiveSummary: null,
      workflowState: this.createInitialWorkflowState(incidentId),
      slackEvent: isSlack ? (input as SlackEvent) : null,
      timeline,
      createdAt: now,
      updatedAt: now,
      resolvedAt: null,
    }

    this.store.set(incidentId, incident)

    // Run processing sequence
    try {
      // Step 1: Parse Event
      incident = this.updateStep(incident, 'parse_event', 'running')
      const parseStart = Date.now()
      await new Promise((resolve) => setTimeout(resolve, 100))
      incident = this.updateStep(
        incident,
        'parse_event',
        'completed',
        `Extracted email (${customerEmail}) and description`,
        Date.now() - parseStart
      )

      // Step 2: Fetch Customer (HubSpot)
      incident.status = 'enriching'
      incident = this.updateStep(incident, 'fetch_customer', 'running')
      const customerStart = Date.now()
      const hubspotRes = await hubspotAdapter.getCustomerByEmail(customerEmail)

      if (hubspotRes.success && hubspotRes.customer) {
        incident.customer = hubspotRes.customer
        incident = this.updateStep(
          incident,
          'fetch_customer',
          'completed',
          `${hubspotRes.customer.name} (${hubspotRes.customer.tier.toUpperCase()}, $${hubspotRes.customer.contractValue.toLocaleString()} ACV)`,
          Date.now() - customerStart
        )
        this.addTimelineEvent(
          incident,
          'customer_enriched',
          'Customer Context Retrieved',
          `HubSpot: ${hubspotRes.customer.name} (${hubspotRes.customer.tier.toUpperCase()})`,
          'success'
        )
      } else {
        incident = this.updateStep(
          incident,
          'fetch_customer',
          'failed',
          'Customer record not found in HubSpot',
          Date.now() - customerStart,
          hubspotRes.error || 'Not found'
        )
      }

      // Step 3: Fetch Billing (Stripe)
      incident = this.updateStep(incident, 'fetch_billing', 'running')
      const billingStart = Date.now()
      if (incident.customer) {
        const stripeRes = await stripeAdapter.getBillingStatus(incident.customer.id)
        if (stripeRes.success && stripeRes.billing) {
          incident.billing = stripeRes.billing
          incident = this.updateStep(
            incident,
            'fetch_billing',
            'completed',
            `${stripeRes.billing.subscriptionStatus.toUpperCase()} plan, $${stripeRes.billing.mrr.toLocaleString()} MRR`,
            Date.now() - billingStart
          )
          this.addTimelineEvent(
            incident,
            'billing_enriched',
            'Billing Status Retrieved',
            `Stripe: Subscription ${stripeRes.billing.subscriptionStatus}`,
            'success'
          )
        } else {
          incident = this.updateStep(
            incident,
            'fetch_billing',
            'failed',
            'Billing record not found in Stripe',
            Date.now() - billingStart
          )
        }
      } else {
        incident = this.updateStep(
          incident,
          'fetch_billing',
          'skipped',
          'Skipped: Customer record missing'
        )
      }

      // Step 4: Fetch Issues (GitHub)
      incident = this.updateStep(incident, 'fetch_issues', 'running')
      const issuesStart = Date.now()
      const relatedIssues = await githubAdapter.getRelatedIssues(description)
      incident.relatedIssues = relatedIssues
      incident = this.updateStep(
        incident,
        'fetch_issues',
        'completed',
        `${relatedIssues.length} related engineering issues found`,
        Date.now() - issuesStart
      )
      if (relatedIssues.length > 0) {
        this.addTimelineEvent(
          incident,
          'issues_enriched',
          'Related Issues Found',
          `GitHub: ${relatedIssues.length} matching issues found`,
          'success'
        )
      }

      // Step 5: AI Analysis (Gemini)
      incident.status = 'analyzing'
      incident = this.updateStep(incident, 'ai_analysis', 'running')
      const aiStart = Date.now()
      const aiDecision = await aiPipelineService.analyzeIncident({
        description,
        customer: incident.customer,
        billing: incident.billing,
        relatedIssues: incident.relatedIssues,
      })
      incident.aiDecision = aiDecision
      incident = this.updateStep(
        incident,
        'ai_analysis',
        'completed',
        `${aiDecision.severity.toUpperCase()} (${Math.round(aiDecision.confidence * 100)}% confidence)`,
        Date.now() - aiStart
      )
      this.addTimelineEvent(
        incident,
        'ai_analysis_complete',
        'AI Severity Analysis Complete',
        `${aiDecision.model}: ${aiDecision.severity.toUpperCase()} (${Math.round(aiDecision.confidence * 100)}% confidence)`,
        'success'
      )

      // Step 6: Triage Decision
      incident.status = 'triaged'
      const triageRes = triageService.classifySeverity(aiDecision, incident.customer)
      incident.severity = triageRes.severity

      // Steps 7-10: Escalation or Resolution
      if (triageRes.shouldEscalate) {
        incident.status = 'escalated'
        const escalationRes = await escalationService.executeEscalation(incident)
        incident.escalation = escalationRes
        incident.executiveSummary = escalationRes.executiveSummary

        // Helper to convert ActionResultStatus to WorkflowStepStatus
        const mapStatus = (status: 'success' | 'failed' | 'skipped'): WorkflowStep['status'] => {
          if (status === 'success') return 'completed'
          return status
        }

        // Update workflow step statuses from escalation result
        for (const act of escalationRes.actions) {
          switch (act.action) {
            case 'create_linear_ticket':
              incident = this.updateStep(incident, 'create_ticket', mapStatus(act.status), act.message, act.durationMs, act.error)
              break
            case 'notify_slack':
              incident = this.updateStep(incident, 'notify_slack', mapStatus(act.status), act.message, act.durationMs, act.error)
              break
            case 'generate_summary':
              incident = this.updateStep(incident, 'generate_summary', mapStatus(act.status), act.message, act.durationMs, act.error)
              break
            case 'update_notion':
              incident = this.updateStep(incident, 'update_notion', mapStatus(act.status), act.message, act.durationMs, act.error)
              break
            case 'send_email':
              incident = this.updateStep(incident, 'send_email', mapStatus(act.status), act.message, act.durationMs, act.error)
              break
          }
        }

        this.addTimelineEvent(
          incident,
          'escalation_complete',
          'Incident Escalated',
          `Linear ticket ${escalationRes.linearTicket ? escalationRes.linearTicket.identifier : 'created'}, Slack & Notion notified, Leadership emailed`,
          'success'
        )
      } else {
        // Skip escalation steps if escalation not required
        incident = this.updateStep(incident, 'create_ticket', 'skipped', 'Skipped: Escalation threshold not met')
        incident = this.updateStep(incident, 'notify_slack', 'skipped', 'Skipped: Escalation threshold not met')
        incident = this.updateStep(incident, 'generate_summary', 'skipped', 'Skipped: Escalation threshold not met')
        incident = this.updateStep(incident, 'update_notion', 'skipped', 'Skipped: Escalation threshold not met')
        incident = this.updateStep(incident, 'send_email', 'skipped', 'Skipped: Escalation threshold not met')

        incident.status = 'resolved'
        incident.resolvedAt = new Date().toISOString()
        this.addTimelineEvent(
          incident,
          'incident_resolved',
          'Incident Resolved (Standard Queue)',
          `Severity ${(incident.severity || 'MEDIUM').toUpperCase()} held in standard queue per customer tier rule`,
          'success'
        )
      }

      // Finalize Workflow State
      const overallCompletedAt = new Date().toISOString()
      const totalDurationMs = new Date(overallCompletedAt).getTime() - new Date(incident.workflowState.startedAt).getTime()

      incident.workflowState.completedAt = overallCompletedAt
      incident.workflowState.totalDurationMs = totalDurationMs
      incident.workflowState.overallStatus = 'completed'
      incident.updatedAt = overallCompletedAt

      this.store.set(incidentId, incident)
      return incident
    } catch (err: unknown) {
      console.error(`[Orchestrator] Error processing incident ${incidentId}:`, err)
      incident.workflowState.overallStatus = 'failed'
      incident.updatedAt = new Date().toISOString()
      this.store.set(incidentId, incident)
      return incident
    }
  }

  private updateStep(
    incident: Incident,
    stepId: string,
    status: WorkflowStep['status'],
    output?: string | null,
    durationMs?: number | null,
    error?: string | null
  ): Incident {
    const steps = incident.workflowState.steps.map((s) => {
      if (s.id === stepId) {
        return {
          ...s,
          status,
          startedAt: status === 'running' ? new Date().toISOString() : s.startedAt,
          completedAt: status === 'completed' || status === 'failed' ? new Date().toISOString() : s.completedAt,
          durationMs: durationMs !== undefined ? durationMs : s.durationMs,
          output: output !== undefined ? output : s.output,
          error: error !== undefined ? error : s.error,
        }
      }
      return s
    })

    return {
      ...incident,
      workflowState: {
        ...incident.workflowState,
        currentStep: stepId,
        steps,
      },
    }
  }

  private addTimelineEvent(
    incident: Incident,
    type: string,
    title: string,
    description: string,
    status: TimelineEvent['status']
  ): void {
    const evt: TimelineEvent = {
      id: generateId('evt'),
      timestamp: new Date().toISOString(),
      type,
      title,
      description,
      status,
    }
    incident.timeline.push(evt)
  }

  public getIncidents(filters?: { severity?: string; status?: string }): Incident[] {
    let list = Array.from(this.store.values())

    if (filters?.severity) {
      list = list.filter((i) => i.severity === filters.severity)
    }
    if (filters?.status) {
      list = list.filter((i) => i.status === filters.status)
    }

    // Sort by createdAt descending
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  public getIncidentById(id: string): Incident | null {
    return this.store.get(id) || null
  }
}

export const orchestratorService = new OrchestratorService()
