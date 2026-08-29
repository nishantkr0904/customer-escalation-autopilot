'use client'

import React, { useEffect, useState } from 'react'
import { StatsGrid } from '@/components/dashboard/stats-grid'
import { RecentIncidents } from '@/components/dashboard/recent-incidents'
import { SeverityChart } from '@/components/dashboard/severity-chart'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { Incident } from '@/lib/types'

export default function DashboardPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchIncidents = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/incidents')
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const data = await res.json()
      if (data.incidents) {
        setIncidents(data.incidents)
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIncidents()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div>
        <h1 className="text-xl font-bold text-slate-100">Executive Incident Command</h1>
        <p className="text-xs text-slate-400 mt-1">
          Automated customer escalation triage, context retrieval, and SLA monitoring
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex justify-between items-center">
          <span>Failed to load incident metrics: {error}</span>
          <button
            onClick={fetchIncidents}
            className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded font-semibold text-[11px]"
          >
            Retry
          </button>
        </div>
      )}

      {/* Metric Stats Cards */}
      <StatsGrid incidents={incidents} loading={loading} />

      {/* Main Grid: Recent Table (Left) + Chart & Quick Actions Stacked (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentIncidents incidents={incidents} loading={loading} />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <SeverityChart incidents={incidents} loading={loading} />
        </div>
      </div>
    </div>
  )
}
