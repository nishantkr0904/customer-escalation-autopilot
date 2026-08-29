import { LinearTicket, LinearTicketInput, HealthCheckResponse } from '../types'
import { LinearAdapter } from './types'
import { generateId } from '../utils/formatters'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const simulateLatency = () => delay(100 + Math.floor(Math.random() * 400))

class MockLinearAdapter implements LinearAdapter {
  private ticketsInMemory: LinearTicket[] = []
  private ticketCounter = 2848

  async createTicket(input: LinearTicketInput): Promise<LinearTicket> {
    await simulateLatency()
    const identifier = `ENG-${this.ticketCounter++}`
    const ticketId = generateId('lin')

    const ticket: LinearTicket = {
      id: ticketId,
      identifier,
      title: input.title,
      description: input.description,
      priority: input.priority,
      status: 'todo',
      assignee: 'alex.kumar',
      teamId: 'team_engineering',
      labels: input.labels || ['incident'],
      incidentId: input.incidentId,
      url: `https://linear.app/company/issue/${identifier}`,
      createdAt: new Date().toISOString(),
    }

    this.ticketsInMemory.push(ticket)
    console.log(`[Linear Mock] Ticket created: ${identifier} ("${input.title}")`)
    return ticket
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    const start = Date.now()
    await delay(30 + Math.floor(Math.random() * 60))
    const duration = Date.now() - start

    return {
      service: 'linear',
      displayName: 'Linear',
      status: 'healthy',
      responseTimeMs: duration,
      lastChecked: new Date().toISOString(),
      lastSuccessful: new Date().toISOString(),
      uptime: 100.0,
      consecutiveFailures: 0,
      error: null,
      metadata: {
        ticketsCreated: 12 + this.ticketsInMemory.length,
      },
    }
  }
}

export const linearAdapter = new MockLinearAdapter()
