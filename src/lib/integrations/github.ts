import githubIssuesData from '../mock-data/github-issues.json'
import { GitHubIssue, HealthCheckResponse } from '../types'
import { GitHubAdapter } from './types'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const simulateLatency = () => delay(100 + Math.floor(Math.random() * 400))

class MockGitHubAdapter implements GitHubAdapter {
  private issues: GitHubIssue[] = githubIssuesData as GitHubIssue[]

  async getRelatedIssues(query: string): Promise<GitHubIssue[]> {
    await simulateLatency()
    console.log(`[GitHub Mock] Searching related issues for query: "${query}"`)
    const terms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2)

    if (terms.length === 0) {
      return this.issues.slice(0, 3)
    }

    const scoredIssues = this.issues.map((issue) => {
      const text = `${issue.title} ${issue.body} ${issue.labels.join(' ')}`.toLowerCase()
      let matches = 0
      for (const term of terms) {
        if (text.includes(term)) {
          matches++
        }
      }
      const score = Math.min(0.95, Number((0.3 + (matches / terms.length) * 0.65).toFixed(2)))
      return { ...issue, relevanceScore: matches > 0 ? score : issue.relevanceScore }
    })

    const matching = scoredIssues
      .filter((issue) => {
        const text = `${issue.title} ${issue.body} ${issue.labels.join(' ')}`.toLowerCase()
        return terms.some((term) => text.includes(term))
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore)

    if (matching.length === 0) {
      return this.issues.slice(0, 2)
    }

    return matching
  }

  async healthCheck(): Promise<HealthCheckResponse> {
    const start = Date.now()
    await delay(60 + Math.floor(Math.random() * 100))
    const duration = Date.now() - start

    return {
      service: 'github',
      displayName: 'GitHub Issues',
      status: 'healthy',
      responseTimeMs: duration,
      lastChecked: new Date().toISOString(),
      lastSuccessful: new Date().toISOString(),
      uptime: 99.5,
      consecutiveFailures: 0,
      error: null,
      metadata: {
        issuesIndexed: this.issues.length,
      },
    }
  }
}

export const githubAdapter = new MockGitHubAdapter()
