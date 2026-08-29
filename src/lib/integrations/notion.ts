import { NotionEntry, HealthCheckResponse } from '../types'
import { NotionAdapter } from './types'
import { generateId } from '../utils/formatters'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const simulateLatency = () => delay(100 + Math.floor(Math.random() * 400))

class MockNotionAdapter implements NotionAdapter {
  private entriesInMemory: NotionEntry[] = []

  async createIncidentEntry(input: Partial<NotionEntry>): Promise<NotionEntry> {
    await simulateLatency()
    const id = generateId('notion_pg')

    const entry: NotionEntry = {
      id,
      incidentId: input.incidentId || generateId('inc'),
      title: input.title || 'Untitled Incident',
      severity: input.severity || 'medium',
      customer: input.customer || 'Unknown Customer',
      customerTier: input.customerTier || 'smb',
      status: input.status || 'escalated',
      summary: input.summary || '',
      aiConfidence: input.aiConfidence || 0.85,
      linearTicket: input.linearTicket || null,
      assignee: input.assignee || 'alex.kumar',
      impactScope: input.impactScope || 'Standard incident impact',
      rootCause: input.rootCause || null,
      resolution: input.resolution || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      url: `https://notion.so/company/incident-log/${id}`,
    }

    this.entriesInMemory.push(entry)
    console.log(`[Notion Mock] Incident entry created: ${entry.id} ("${entry.title}")`)
    return entry
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    const start = Date.now()
    await delay(50 + Math.floor(Math.random() * 100))
    const duration = Date.now() - start

    return {
      service: 'notion',
      displayName: 'Notion',
      status: 'healthy',
      responseTimeMs: duration,
      lastChecked: new Date().toISOString(),
      lastSuccessful: new Date().toISOString(),
      uptime: 99.8,
      consecutiveFailures: 0,
      error: null,
      metadata: {
        entriesCreated: 15 + this.entriesInMemory.length,
      },
    }
  }
}

export const notionAdapter = new MockNotionAdapter()
