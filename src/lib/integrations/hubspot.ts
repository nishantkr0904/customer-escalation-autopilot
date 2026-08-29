import customersData from '../mock-data/customers.json'
import { Customer, HubSpotResponse, HealthCheckResponse } from '../types'
import { HubSpotAdapter } from './types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const simulateLatency = () => delay(100 + Math.floor(Math.random() * 400))

class MockHubSpotAdapter implements HubSpotAdapter {
  private customers: Customer[] = customersData as Customer[]

  async getCustomerByEmail(email: string): Promise<HubSpotResponse> {
    await simulateLatency()
    console.log(`[HubSpot Mock] Looking up customer by email: ${email}`)
    const customer = this.customers.find(
      (c) => c.email.toLowerCase() === email.toLowerCase()
    )

    if (!customer) {
      console.log(`[HubSpot Mock] No customer found for email: ${email}`)
      return {
        success: false,
        customer: null,
        source: 'hubspot',
        retrievedAt: new Date().toISOString(),
        cached: false,
        error: `Customer not found for email: ${email}`,
      }
    }

    return {
      success: true,
      customer,
      source: 'hubspot',
      retrievedAt: new Date().toISOString(),
      cached: false,
      error: null,
    }
  }

  async getCustomerById(id: string): Promise<HubSpotResponse> {
    await simulateLatency()
    console.log(`[HubSpot Mock] Looking up customer by ID: ${id}`)
    const customer = this.customers.find((c) => c.id === id)

    if (!customer) {
      return {
        success: false,
        customer: null,
        source: 'hubspot',
        retrievedAt: new Date().toISOString(),
        cached: false,
        error: `Customer not found for ID: ${id}`,
      }
    }

    return {
      success: true,
      customer,
      source: 'hubspot',
      retrievedAt: new Date().toISOString(),
      cached: false,
      error: null,
    }
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    const start = Date.now()
    await delay(50 + Math.floor(Math.random() * 100))
    const duration = Date.now() - start

    return {
      service: 'hubspot',
      displayName: 'HubSpot CRM',
      status: 'healthy',
      responseTimeMs: duration,
      lastChecked: new Date().toISOString(),
      lastSuccessful: new Date().toISOString(),
      uptime: 99.8,
      consecutiveFailures: 0,
      error: null,
      metadata: {
        recordsAvailable: this.customers.length,
        cacheHitRate: 0.85,
      },
    }
  }
}

export const hubspotAdapter = new MockHubSpotAdapter()
