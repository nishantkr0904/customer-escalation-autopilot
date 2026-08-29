import { ExecutiveSummary, HealthCheckResponse } from '../types'
import { EmailAdapter } from './types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const simulateLatency = () => delay(100 + Math.floor(Math.random() * 400))

class MockEmailAdapter implements EmailAdapter {
  private emailsSentCount = 6

  async sendSummary(to: string[], summary: ExecutiveSummary): Promise<void> {
    await simulateLatency()
    console.log(
      `[Email Mock] Summary sent to [${to.join(', ')}]: "${summary.title}" (Severity: ${summary.severity.toUpperCase()})`
    )
    this.emailsSentCount++
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    const start = Date.now()
    await delay(40 + Math.floor(Math.random() * 80))
    const duration = Date.now() - start

    return {
      service: 'email',
      displayName: 'Email Service',
      status: 'healthy',
      responseTimeMs: duration,
      lastChecked: new Date().toISOString(),
      lastSuccessful: new Date().toISOString(),
      uptime: 99.9,
      consecutiveFailures: 0,
      error: null,
      metadata: {
        emailsSent: this.emailsSentCount,
      },
    }
  }
}

export const emailAdapter = new MockEmailAdapter()
