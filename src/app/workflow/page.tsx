'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Incident } from '@/lib/types'
import { PipelineView } from '@/components/workflow/pipeline-view'

export default function WorkflowPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [selectedId, setSelectedSelectedId] = useState<string>('')
  const [activeIncident, setActiveIncident] = useState<Incident | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch list of incidents for dropdown selector
  const fetchIncidentsList = useCallback(async () => {
    try {
      const res = await fetch('/api/incidents')
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const data = await res.json()
      if (data.incidents && data.incidents.length > 0) {
        setIncidents(data.incidents)
        // Default to first incident if none selected
        setSelectedSelectedId((prev) => (prev ? prev : data.incidents[0].id))
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      setError(errorMsg)
    }
  }, [])

  // Fetch single active incident workflow state
  const fetchActiveIncident = useCallback(async (id: string) => {
    if (!id) return
    try {
      setError(null)
      const res = await fetch(`/api/incidents/${id}`)
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const data = await res.json()
      if (data.incident) {
        setActiveIncident(data.incident)
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchIncidentsList()
  }, [fetchIncidentsList])

  // When selected incident changes
  useEffect(() => {
    if (selectedId) {
      setLoading(true)
      fetchActiveIncident(selectedId)
    }
  }, [selectedId, fetchActiveIncident])

  // Live polling every 2s if selected incident workflow is running
  useEffect(() => {
    if (!selectedId || !activeIncident) return

    const isRunning = activeIncident.workflowState?.overallStatus === 'running'
    if (!isRunning) return

    const interval = setInterval(() => {
      fetchActiveIncident(selectedId)
    }, 2000)

    return () => clearInterval(interval)
  }, [selectedId, activeIncident, fetchActiveIncident])

  return (
    <div className="space-y-6">
      {/* Top Header Bar with Dropdown Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Live Workflow Visualization</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time 10-step incident triage, context retrieval, and escalation pipeline
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {incidents.length > 0 && (
            <div className="flex items-center gap-2">
              <label htmlFor="incident-select" className="text-xs font-semibold text-slate-400 shrink-0">
                Workflow Target:
              </label>
              <select
                id="incident-select"
                value={selectedId}
                onChange={(e) => setSelectedSelectedId(e.target.value)}
                className="bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-medium focus:outline-none focus:border-indigo-500 max-w-[220px] truncate"
              >
                {incidents.map((inc) => (
                  <option key={inc.id} value={inc.id}>
                    {inc.title.slice(0, 30)}... ({inc.id.slice(-6)})
                  </option>
                ))}
              </select>
            </div>
          )}

          <Link href="/incidents">
            <Button variant="primary" size="sm">
              ⚡ Process New Incident
            </Button>
          </Link>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex justify-between items-center">
          <span>Failed to load workflow state: {error}</span>
          <Button variant="secondary" size="sm" onClick={() => fetchActiveIncident(selectedId)}>
            Retry
          </Button>
        </div>
      )}

      {/* Main Pipeline Display / Skeletons */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton variant="card" height="120px" width="100%" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="card" height="64px" width="100%" />
          ))}
        </div>
      ) : activeIncident ? (
        <PipelineView incident={activeIncident} />
      ) : (
        <div className="glass-panel rounded-xl p-12 text-center max-w-md mx-auto my-12 space-y-3">
          <span className="text-4xl block">⚡</span>
          <h3 className="text-base font-bold text-slate-200">No Active Workflows</h3>
          <p className="text-xs text-slate-400">
            No incident workflows available to display. Process a new incident to see the live pipeline.
          </p>
        </div>
      )}
    </div>
  )
}
