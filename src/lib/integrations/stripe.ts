import stripeAccountsData from '../mock-data/stripe-accounts.json'
import { StripeBilling, StripeResponse, HealthCheckResponse } from '../types'
import { StripeAdapter } from './types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const simulateLatency = () => delay(100 + Math.floor(Math.random() * 400))

class MockStripeAdapter implements StripeAdapter {
  private billingRecords: StripeBilling[] = stripeAccountsData as StripeBilling[]

  async getBillingStatus(customerId: string): Promise<StripeResponse> {
    await simulateLatency()
    console.log(`[Stripe Mock] Looking up billing for customer ID: ${customerId}`)
    const billing = this.billingRecords.find((b) => b.customerId === customerId)

    if (!billing) {
      console.log(`[Stripe Mock] No billing record found for customer ID: ${customerId}`)
      return {
        success: false,
        billing: null,
        source: 'stripe',
        retrievedAt: new Date().toISOString(),
        error: `Billing record not found for customer ID: ${customerId}`,
      }
    }

    return {
      success: true,
      billing,
      source: 'stripe',
      retrievedAt: new Date().toISOString(),
      error: null,
    }
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    const start = Date.now()
    await delay(40 + Math.floor(Math.random() * 80))
    const duration = Date.now() - start

    return {
      service: 'stripe',
      displayName: 'Stripe Billing',
      status: 'healthy',
      responseTimeMs: duration,
      lastChecked: new Date().toISOString(),
      lastSuccessful: new Date().toISOString(),
      uptime: 100.0,
      consecutiveFailures: 0,
      error: null,
      metadata: {
        accountsAvailable: this.billingRecords.length,
      },
    }
  }
}

export const stripeAdapter = new MockStripeAdapter()
