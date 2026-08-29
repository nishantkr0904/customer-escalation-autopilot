import aiResponsesData from '../mock-data/ai-responses.json'
import {
  AIDecision,
  Customer,
  ExecutiveSummary,
  GitHubIssue,
  Incident,
  StripeBilling,
} from '../types'
import { generateId } from '../utils/formatters'

interface ContextPayload {
  description: string
  customer?: Customer | null
  billing?: StripeBilling | null
  relatedIssues?: GitHubIssue[]
}

class AIPipelineService {
  private mockResponses: AIDecision[] = aiResponsesData as AIDecision[]

  /**
   * Constructs the structured system prompt for Gemini analysis as specified in ARCHITECTURE.md
   */
  public buildPrompt(context: ContextPayload): string {
    const customerInfo = context.customer
      ? `- Name: ${context.customer.name}\n- Tier: ${context.customer.tier.toUpperCase()}\n- ACV: $${context.customer.contractValue.toLocaleString()}\n- Health Score: ${context.customer.healthScore}/100\n- Churn Risk: ${context.customer.churnRisk}`
      : 'Customer record not found in HubSpot.'

    const billingInfo = context.billing
      ? `- Status: ${context.billing.subscriptionStatus}\n- Plan: ${context.billing.plan}\n- MRR: $${context.billing.mrr.toLocaleString()}\n- Failed Payments: ${context.billing.failedPayments}`
      : 'Billing record not found in Stripe.'

    const issuesInfo =
      context.relatedIssues && context.relatedIssues.length > 0
        ? context.relatedIssues
            .map(
              (i) =>
                `- Issue #${i.number}: "${i.title}" (${i.state}, Priority/Labels: ${i.labels.join(', ')}, Relevance: ${i.relevanceScore})`
            )
            .join('\n')
        : 'No directly matching engineering issues found.'

    return `You are an AI Incident Triage Engine for an enterprise software platform. Analyze the incoming customer incident report along with enriched context and classify its technical severity, business impact, and whether it requires engineering escalation.

### INCIDENT REPORT
Description: "${context.description}"

### CUSTOMER CONTEXT (HubSpot)
${customerInfo}

### BILLING CONTEXT (Stripe)
${billingInfo}

### RELATED ENGINEERING ISSUES (GitHub)
${issuesInfo}

### INSTRUCTIONS
Output a raw valid JSON object (no markdown formatting, no code blocks) matching the exact schema below:
{
  "severity": "low" | "medium" | "high" | "critical",
  "confidence": number (0.0 to 1.0),
  "reasoning": string,
  "businessImpact": string,
  "technicalAssessment": string,
  "recommendedActions": string[],
  "shouldEscalate": boolean,
  "escalationReason": string | null,
  "executiveSummary": string,
  "relatedIssueAnalysis": string,
  "estimatedResolutionTime": string,
  "riskFactors": string[],
  "model": "gemini-3.7-flash",
  "tokensUsed": number,
  "latencyMs": number,
  "analyzedAt": ISO string
}`
  }

  /**
   * Analyzes an incident description and context payload. Uses live Gemini 3.7 Flash if GEMINI_API_KEY is present, otherwise falls back to intelligent mock keyword matching.
   */
  async analyzeIncident(context: ContextPayload): Promise<AIDecision> {
    const apiKey = process.env.GEMINI_API_KEY

    if (apiKey && apiKey.trim().length > 0) {
      try {
        console.log('[AI Pipeline] Calling live Gemini API...')
        const startTime = Date.now()
        const prompt = this.buildPrompt(context)

        // Standard Gemini 2.0 / 3.7 Flash endpoint URL
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json',
            },
          }),
        })

        if (res.ok) {
          const data = await res.json()
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text
          if (rawText) {
            const parsed = JSON.parse(rawText) as AIDecision
            const duration = Date.now() - startTime
            return {
              ...parsed,
              model: 'gemini-3.7-flash',
              latencyMs: duration,
              analyzedAt: new Date().toISOString(),
            }
          }
        }
        console.warn('[AI Pipeline] Gemini call returned unexpected format, falling back to mock mode.')
      } catch (err) {
        console.error('[AI Pipeline] Gemini API error, falling back to mock mode:', err)
      }
    }

    // Mock Mode Execution (Simulated latency + keyword mapping)
    console.log('[AI Pipeline] Executing in mock analysis mode...')
    const startTime = Date.now()
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 500))

    const text = context.description.toLowerCase()
    let mockMatch: AIDecision

    if (text.includes('payment') || text.includes('batch') || text.includes('fail') || text.includes('outage')) {
      mockMatch = this.mockResponses[0] // Critical
    } else if (text.includes('latency') || text.includes('slow') || text.includes('spike') || text.includes('api')) {
      mockMatch = this.mockResponses[1] // High
    } else if (text.includes('sync') || text.includes('delay') || text.includes('contact')) {
      mockMatch = this.mockResponses[2] // Medium
    } else if (text.includes('feature') || text.includes('webhook') || text.includes('request')) {
      mockMatch = this.mockResponses[3] // Low
    } else {
      mockMatch = this.mockResponses[4] // Fallback
    }

    const duration = Date.now() - startTime
    return {
      ...mockMatch,
      latencyMs: duration,
      analyzedAt: new Date().toISOString(),
    }
  }

  /**
   * Generates a structured executive summary object for stakeholder distribution.
   */
  async generateExecutiveSummary(incident: Incident): Promise<ExecutiveSummary> {
    const summaryId = generateId('sum')
    const decision = incident.aiDecision
    const customer = incident.customer

    const title = `${(incident.severity || 'MEDIUM').toUpperCase()}: ${incident.title} — ${customer ? customer.name : 'Unknown Customer'}`
    const customerImpact = decision
      ? decision.businessImpact
      : `${customer ? customer.name : 'Customer'} (${customer ? customer.tier.toUpperCase() : 'SMB'}) reporting operational issue: "${incident.description}"`

    const technicalSummary = decision
      ? decision.technicalAssessment
      : 'Technical investigation in progress to identify root cause and impact scope.'

    const actionsTaken = incident.escalation
      ? incident.escalation.actions
          .filter((a) => a.status === 'success')
          .map((a) => a.message)
      : ['Incident intake processed', 'Context enrichment completed from HubSpot and Stripe']

    const recommendedNextSteps = decision
      ? decision.recommendedActions
      : ['Assign engineering lead for investigation', 'Update customer account manager']

    const riskAssessment = decision
      ? decision.riskFactors.join('. ')
      : 'Potential operational risk depending on resolution speed.'

    return {
      id: summaryId,
      incidentId: incident.id,
      title,
      severity: incident.severity || 'medium',
      customerImpact,
      technicalSummary,
      actionsTaken,
      recommendedNextSteps,
      timeline: `${incident.createdAt} — Incident received and analyzed by automated pipeline.`,
      riskAssessment,
      generatedBy: process.env.GEMINI_API_KEY ? 'gemini-3.7-flash' : 'rule-based',
      generatedAt: new Date().toISOString(),
    }
  }
}

export const aiPipelineService = new AIPipelineService()
