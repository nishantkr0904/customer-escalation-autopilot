import { AIDecision, Customer, SeverityLevel } from '../types'
import { ESCALATION_RULES } from '../utils/constants'

export interface TriageResult {
  severity: SeverityLevel
  shouldEscalate: boolean
  reason: string
  overridden: boolean
}

class TriageService {
  /**
   * Classifies final severity and determines whether escalation is required based on customer tier, AI confidence, and account risk overrides.
   */
  public classifySeverity(
    aiDecision: AIDecision,
    customer: Customer | null
  ): TriageResult {
    let finalSeverity: SeverityLevel = aiDecision.severity
    let overridden = false
    const overrideReasons: string[] = []

    // Customer tier (fallback to SMB if customer not found)
    const tier = customer ? customer.tier : 'smb'

    // Account risk overrides:
    if (customer) {
      // Rule 1: Enterprise customer with health score < 50 and Medium severity -> Upgrade to High
      if (customer.tier === 'enterprise' && customer.healthScore < 50 && finalSeverity === 'medium') {
        finalSeverity = 'high'
        overridden = true
        overrideReasons.push('Enterprise customer health score < 50 upgraded severity from Medium to High')
      }

      // Rule 2: High churn risk customer with Medium severity -> Upgrade to High
      if (customer.churnRisk === 'high' && finalSeverity === 'medium') {
        finalSeverity = 'high'
        overridden = true
        overrideReasons.push('High churn risk customer upgraded severity from Medium to High')
      }
    }

    // Determine baseline tier escalation requirement
    const minEscalationSeverity = ESCALATION_RULES[tier]
    const severityHierarchy: Record<SeverityLevel, number> = {
      low: 1,
      medium: 2,
      high: 3,
      critical: 4,
    }

    let shouldEscalate =
      severityHierarchy[finalSeverity] >= severityHierarchy[minEscalationSeverity]

    // High confidence override: If AI confidence > 0.90 AND severity is High+, always escalate regardless of tier
    if (aiDecision.confidence >= 0.9 && severityHierarchy[finalSeverity] >= 3) {
      if (!shouldEscalate) {
        shouldEscalate = true
        overrideReasons.push('High AI confidence (>=90%) for High+ severity triggered mandatory escalation')
      }
    }

    // Construct human-readable decision reason
    let reason = `${tier.toUpperCase()} customer baseline rule: requires ${minEscalationSeverity.toUpperCase()}+ severity for escalation.`
    if (shouldEscalate) {
      reason += ` Final severity ${finalSeverity.toUpperCase()} meets or exceeds threshold.`
    } else {
      reason += ` Final severity ${finalSeverity.toUpperCase()} is below escalation threshold.`
    }

    if (overrideReasons.length > 0) {
      reason += ` Overrides applied: ${overrideReasons.join('; ')}.`
    }

    return {
      severity: finalSeverity,
      shouldEscalate,
      reason,
      overridden,
    }
  }
}

export const triageService = new TriageService()
