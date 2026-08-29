import {
  HubSpotResponse,
  StripeResponse,
  GitHubIssue,
  LinearTicket,
  LinearTicketInput,
  NotionEntry,
  ExecutiveSummary,
  HealthCheckResponse,
} from '../types'

export interface HubSpotAdapter {
  getCustomerByEmail(email: string): Promise<HubSpotResponse>
  getCustomerById(id: string): Promise<HubSpotResponse>
  healthCheck(): Promise<HealthCheckResponse>
}

export interface StripeAdapter {
  getBillingStatus(customerId: string): Promise<StripeResponse>
  healthCheck(): Promise<HealthCheckResponse>
}

export interface GitHubAdapter {
  getRelatedIssues(query: string): Promise<GitHubIssue[]>
  healthCheck(): Promise<HealthCheckResponse>
}

export interface LinearAdapter {
  createTicket(input: LinearTicketInput): Promise<LinearTicket>
  healthCheck(): Promise<HealthCheckResponse>
}

export interface SlackAdapter {
  sendNotification(channel: string, message: Record<string, unknown> | string): Promise<void>
  healthCheck(): Promise<HealthCheckResponse>
}

export interface NotionAdapter {
  createIncidentEntry(input: Partial<NotionEntry>): Promise<NotionEntry>
  healthCheck(): Promise<HealthCheckResponse>
}

export interface EmailAdapter {
  sendSummary(to: string[], summary: ExecutiveSummary): Promise<void>
  healthCheck(): Promise<HealthCheckResponse>
}
