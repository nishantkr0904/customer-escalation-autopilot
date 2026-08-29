'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import customersData from '@/lib/mock-data/customers.json'

interface NewIncidentFormProps {
  onClose?: () => void
}

interface DemoScenario {
  id: string
  label: string
  email: string
  source: 'slack' | 'manual'
  description: string
}

const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'critical_enterprise',
    label: '🚨 Critical: Enterprise Payment Failure (Acme Corp)',
    email: 'ops@acmecorp.com',
    source: 'slack',
    description:
      'Acme Corp reporting that their batch payment processing has been failing intermittently for the past 2 hours. Affecting approximately 1,200 transactions. Their finance team is unable to close end-of-month.',
  },
  {
    id: 'high_smb',
    label: '⚠️ High: SMB API Latency Spikes (TechFlow Solutions)',
    email: 'dev@techflow.io',
    source: 'slack',
    description:
      'TechFlow Solutions reporting response times over 5 seconds on their main reporting dashboard and API Gateway analytics aggregation endpoint.',
  },
  {
    id: 'medium_smb',
    label: '🟡 Medium: SMB CRM Data Sync Delay (GrowthMetrics)',
    email: 'dev@growthmetrics.io',
    source: 'manual',
    description:
      'GrowthMetrics reporting intermittent 10-minute sync delays when updating contact lists in CRM connector pipeline.',
  },
  {
    id: 'low_startup',
    label: 'ℹ️ Low: Startup Feature Request (DevStudio Pro)',
    email: 'hello@devstudio.pro',
    source: 'manual',
    description:
      'DevStudio Pro requesting webhook HMAC signature verification support for their deployment CI/CD pipeline.',
  },
]

export const NewIncidentForm: React.FC<NewIncidentFormProps> = ({ onClose }) => {
  const router = useRouter()

  const [customerEmail, setCustomerEmail] = useState('')
  const [description, setDescription] = useState('')
  const [source, setSource] = useState<'slack' | 'manual'>('manual')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filteredEmails, setFilteredEmails] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Handle email autocomplete input
  const handleEmailChange = (val: string) => {
    setCustomerEmail(val)
    if (val.trim().length > 0) {
      const matches = customersData
        .map((c) => c.email)
        .filter((e) => e.toLowerCase().includes(val.toLowerCase()))
      setFilteredEmails(matches)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  // Load selected demo preset scenario
  const handleSelectScenario = (scenarioId: string) => {
    const found = DEMO_SCENARIOS.find((s) => s.id === scenarioId)
    if (found) {
      setCustomerEmail(found.email)
      setDescription(found.description)
      setSource(found.source)
      setShowSuggestions(false)
    }
  }

  // Submit form payload to POST /api/incidents
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerEmail.trim() || !description.trim()) {
      setError('Please provide both customer email and incident description.')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerEmail: customerEmail.trim(),
          description: description.trim(),
          source,
        }),
      })

      if (!res.ok) {
        const errJson = await res.json()
        throw new Error(errJson?.error?.message || `Failed to create incident (${res.status})`)
      }

      const data = await res.json()
      const newId = data.incident?.id

      if (onClose) onClose()

      // Navigate directly to workflow visualization page with incident ID param
      router.push(`/workflow?incident=${newId}`)
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Scenario Presets Bar */}
      <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/30">
        <label htmlFor="scenario-preset" className="text-xs font-bold text-indigo-300 block mb-1">
          🎯 Load Pre-configured Demo Scenario
        </label>
        <select
          id="scenario-preset"
          defaultValue=""
          onChange={(e) => handleSelectScenario(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
        >
          <option value="" disabled>
            -- Select a scenario to pre-fill form --
          </option>
          {DEMO_SCENARIOS.map((sc) => (
            <option key={sc.id} value={sc.id}>
              {sc.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer Email with Autocomplete */}
        <div className="relative">
          <label htmlFor="customer-email" className="text-xs font-semibold text-slate-300 block mb-1">
            Customer Contact Email <span className="text-red-400">*</span>
          </label>
          <input
            id="customer-email"
            type="email"
            placeholder="e.g. ops@acmecorp.com"
            value={customerEmail}
            onChange={(e) => handleEmailChange(e.target.value)}
            onFocus={() => customerEmail && setShowSuggestions(true)}
            required
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
          />

          {/* Autocomplete Suggestions Dropdown */}
          {showSuggestions && filteredEmails.length > 0 && (
            <ul className="absolute z-30 left-0 right-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-xl max-h-36 overflow-y-auto text-xs py-1">
              {filteredEmails.map((email) => (
                <li
                  key={email}
                  onClick={() => {
                    setCustomerEmail(email)
                    setShowSuggestions(false)
                  }}
                  className="px-3.5 py-1.5 hover:bg-slate-800 text-slate-200 cursor-pointer font-mono"
                >
                  {email}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Source Dropdown */}
        <div>
          <label htmlFor="incident-source" className="text-xs font-semibold text-slate-300 block mb-1">
            Intake Channel / Source
          </label>
          <select
            id="incident-source"
            value={source}
            onChange={(e) => setSource(e.target.value as 'slack' | 'manual')}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3.5 py-2 text-xs text-slate-200 font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="manual">📝 Manual Intake Form</option>
            <option value="slack">💬 Slack Webhook Channel</option>
          </select>
        </div>

        {/* Description Textarea */}
        <div>
          <label htmlFor="incident-description" className="text-xs font-semibold text-slate-300 block mb-1">
            Incident Description / Report Text <span className="text-red-400">*</span>
          </label>
          <textarea
            id="incident-description"
            rows={4}
            placeholder="Describe the technical issue, error messages, and customer impact scope..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono transition-colors leading-relaxed"
          />
        </div>

        {/* Submit & Cancel Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {onClose && (
            <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="primary" size="md" loading={loading}>
            ⚡ Launch Workflow Pipeline
          </Button>
        </div>
      </form>
    </div>
  )
}
