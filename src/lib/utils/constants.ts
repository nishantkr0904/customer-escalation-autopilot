import { CustomerTier, SeverityLevel, IncidentStatus } from '../types'

export const SEVERITY_LEVELS: SeverityLevel[] = ['low', 'medium', 'high', 'critical']

export const SEVERITY_COLORS: Record<SeverityLevel, { bg: string; text: string; border: string }> = {
  low: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  medium: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  high: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
  critical: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/50' },
}

export const STATUS_LABELS: Record<IncidentStatus, string> = {
  received: 'Received',
  enriching: 'Enriching Context',
  analyzing: 'Analyzing AI',
  triaged: 'Triaged',
  escalated: 'Escalated',
  resolved: 'Resolved',
}

export const SERVICE_NAMES = [
  'hubspot',
  'stripe',
  'github',
  'linear',
  'slack',
  'notion',
  'email',
  'gemini',
] as const

export const ESCALATION_RULES: Record<CustomerTier, SeverityLevel> = {
  enterprise: 'medium',
  smb: 'high',
  startup: 'critical',
  free: 'critical',
}
