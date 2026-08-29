import { HealthCheckResponse } from '../types'
import { SlackAdapter } from './types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const simulateLatency = () => delay(100 + Math.floor(Math.random() * 400))

class MockSlackAdapter implements SlackAdapter {
  private notificationsSentCount = 8

  async sendNotification(channel: string, message: Record<string, unknown> | string): Promise<void> {
    await simulateLatency()
    const summary = typeof message === 'string' ? message : JSON.stringify(message)
    console.log(`[Slack Mock] Notification sent to ${channel}: ${summary}`)
    this.notificationsSentCount++
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    const start = Date.now()
    await delay(30 + Math.floor(Math.random() * 50))
    const duration = Date.now() - start

    return {
      service: 'slack',
      displayName: 'Slack',
      status: 'healthy',
      responseTimeMs: duration,
      lastChecked: new Date().toISOString(),
      lastSuccessful: new Date().toISOString(),
      uptime: 100.0,
      consecutiveFailures: 0,
      error: null,
      metadata: {
        notificationsSent: this.notificationsSentCount,
      },
    }
  }
}

export const slackAdapter = new MockSlackAdapter()
