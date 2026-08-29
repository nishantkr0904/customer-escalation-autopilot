export type CustomerTier = 'enterprise' | 'smb' | 'startup' | 'free'
export type ChurnRisk = 'low' | 'medium' | 'high'
export type IncidentSource = 'slack' | 'manual' | 'webhook'
export type IncidentStatus =
  | 'received'
  | 'enriching'
  | 'analyzing'
  | 'triaged'
  | 'escalated'
  | 'resolved'
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical'
export type TimelineEventStatus = 'success' | 'error' | 'warning'
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'trialing' | 'unpaid'
export type IssueState = 'open' | 'closed'
export type LinearPriority = 1 | 2 | 3 | 4
export type LinearStatus = 'backlog' | 'todo' | 'in_progress' | 'done' | 'canceled'
export type EscalationActionType =
  | 'create_linear_ticket'
  | 'notify_slack'
  | 'generate_summary'
  | 'update_notion'
  | 'send_email'
export type ActionResultStatus = 'success' | 'failed' | 'skipped'
export type WorkflowStepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped'
export type WorkflowOverallStatus = 'running' | 'completed' | 'failed' | 'partial'
export type ServiceHealthStatus = 'healthy' | 'degraded' | 'down' | 'unknown'

export interface Customer {
  id: string
  email: string
  name: string
  contactName: string
  tier: CustomerTier
  contractValue: number
  employeeCount: number
  industry: string
  region: string
  accountManager: string
  healthScore: number
  churnRisk: ChurnRisk
  openTickets: number
  lastContactDate: string
  createdAt: string
}

export interface TimelineEvent {
  id: string
  timestamp: string
  type: string
  title: string
  description: string
  status: TimelineEventStatus
}

export interface SlackEvent {
  eventId: string
  type: string
  channel: string
  channelId: string
  userId: string
  userName: string
  text: string
  customerEmail: string
  timestamp: string
  threadTs: string | null
}

export interface HubSpotResponse {
  success: boolean
  customer: Customer | null
  source: 'hubspot'
  retrievedAt: string
  cached: boolean
  error: string | null
}

export interface StripeBilling {
  customerId: string
  subscriptionStatus: SubscriptionStatus
  plan: string
  mrr: number
  totalSpend: number
  lastPaymentDate: string
  lastPaymentAmount: number
  failedPayments: number
  paymentMethod: string
  billingEmail: string
  nextInvoiceDate: string
}

export interface StripeResponse {
  success: boolean
  billing: StripeBilling | null
  source: 'stripe'
  retrievedAt: string
  error: string | null
}

export interface GitHubIssue {
  id: string
  number: number
  title: string
  state: IssueState
  body: string
  labels: string[]
  assignee: string | null
  repository: string
  url: string
  createdAt: string
  updatedAt: string
  closedAt: string | null
  relevanceScore: number
}

export interface LinearTicket {
  id: string
  identifier: string
  title: string
  description: string
  priority: LinearPriority
  status: LinearStatus
  assignee: string | null
  teamId: string
  labels: string[]
  incidentId: string
  url: string
  createdAt: string
}

export interface NotionEntry {
  id: string
  incidentId: string
  title: string
  severity: SeverityLevel
  customer: string
  customerTier: CustomerTier
  status: string
  summary: string
  aiConfidence: number
  linearTicket: string | null
  assignee: string | null
  impactScope: string
  rootCause: string | null
  resolution: string | null
  createdAt: string
  updatedAt: string
  url: string
}

export interface ExecutiveSummary {
  id: string
  incidentId: string
  title: string
  severity: SeverityLevel
  customerImpact: string
  technicalSummary: string
  actionsTaken: string[]
  recommendedNextSteps: string[]
  timeline: string
  riskAssessment: string
  generatedBy: 'gemini-3.7-flash' | 'rule-based'
  generatedAt: string
}

export interface AIDecision {
  severity: SeverityLevel
  confidence: number
  reasoning: string
  businessImpact: string
  technicalAssessment: string
  recommendedActions: string[]
  shouldEscalate: boolean
  escalationReason: string | null
  executiveSummary: string
  relatedIssueAnalysis: string
  estimatedResolutionTime: string
  riskFactors: string[]
  model: string
  tokensUsed: number
  latencyMs: number
  analyzedAt: string
}

export interface EscalationAction {
  action: EscalationActionType
  status: ActionResultStatus
  message: string
  durationMs: number
  error: string | null
}

export interface EscalationResult {
  incidentId: string
  escalated: boolean
  reason: string
  actions: EscalationAction[]
  linearTicket: LinearTicket | null
  notionEntry: NotionEntry | null
  executiveSummary: ExecutiveSummary | null
  completedAt: string
  partialFailure: boolean
  errors: string[]
}

export interface WorkflowStep {
  id: string
  name: string
  description: string
  status: WorkflowStepStatus
  startedAt: string | null
  completedAt: string | null
  durationMs: number | null
  output: string | null
  error: string | null
  icon: string
}

export interface WorkflowState {
  incidentId: string
  currentStep: string
  steps: WorkflowStep[]
  startedAt: string
  completedAt: string | null
  totalDurationMs: number | null
  overallStatus: WorkflowOverallStatus
}

export interface Incident {
  id: string
  title: string
  description: string
  source: IncidentSource
  status: IncidentStatus
  severity: SeverityLevel | null
  customerEmail: string
  customer: Customer | null
  billing: StripeBilling | null
  relatedIssues: GitHubIssue[]
  aiDecision: AIDecision | null
  escalation: EscalationResult | null
  executiveSummary: ExecutiveSummary | null
  workflowState: WorkflowState
  slackEvent: SlackEvent | null
  timeline: TimelineEvent[]
  createdAt: string
  updatedAt: string
  resolvedAt: string | null
}

export interface HealthCheckResponse {
  service: string
  displayName: string
  status: ServiceHealthStatus
  responseTimeMs: number | null
  lastChecked: string
  lastSuccessful: string | null
  uptime: number
  consecutiveFailures: number
  error: string | null
  metadata: Record<string, unknown>
}

// Input Types
export interface CreateIncidentInput {
  customerEmail: string
  description: string
  source: IncidentSource
}

export interface LinearTicketInput {
  title: string
  description: string
  priority: LinearPriority
  labels: string[]
  incidentId: string
}
