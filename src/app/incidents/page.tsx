'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { IncidentCard } from '@/components/incidents/incident-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Incident } from '@/lib/types'

type StatusTab = 'all' | 'active' | 'triaged' | 'escalated' | 'resolved'

export default function IncidentListPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<StatusTab>('all')

  const fetchIncidents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      let url = '/api/incidents'
      if (selectedSeverity !== 'all') {
        url += `?severity=${selectedSeverity}`
      }
      const res = await fetch(url)
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
  }, [selectedSeverity])

  useEffect(() => {
    fetchIncidents()
  }, [fetchIncidents])

  // Filter incidents by tab status
  const filteredIncidents = incidents.filter((inc) => {
    if (activeTab === 'all') return true
    if (activeTab === 'active') {
      return ['received', 'enriching', 'analyzing'].includes(inc.status)
    }
    return inc.status === activeTab
  })

  const tabs: { id: StatusTab; label: string; count?: number }[] = [
    { id: 'all', label: 'All Incidents', count: incidents.length },
    {
      id: 'active',
      label: 'Active Processing',
      count: incidents.filter((i) => ['received', 'enriching', 'analyzing'].includes(i.status)).length,
    },
    {
      id: 'triaged',
      label: 'Triaged',
      count: incidents.filter((i) => i.status === 'triaged').length,
    },
    {
      id: 'escalated',
      label: 'Escalated',
      count: incidents.filter((i) => i.status === 'escalated').length,
    },
    {
      id: 'resolved',
      label: 'Resolved',
      count: incidents.filter((i) => i.status === 'resolved').length,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Incident Pipeline Registry</h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse and filter customer escalation reports across all lifecycle stages
          </p>
        </div>

        {/* Severity Filter Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="severity-select" className="text-xs font-semibold text-slate-400 shrink-0">
            Severity:
          </label>
          <select
            id="severity-select"
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-medium focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="all">All Severities</option>
            <option value="critical">🔴 Critical</option>
            <option value="high">🟠 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="border-b border-slate-800 flex items-center gap-2 overflow-x-auto pb-px text-xs font-medium">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 border-b-2 transition-all duration-150 whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? 'border-indigo-500 text-indigo-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                  isActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {tab.count ?? 0}
              </span>
            </button>
          )
        })}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex justify-between items-center">
          <span>Error loading incidents: {error}</span>
          <Button variant="secondary" size="sm" onClick={fetchIncidents}>
            Retry
          </Button>
        </div>
      )}

      {/* Content Grid / Skeletons / Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-panel rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-center">
                <Skeleton variant="text" height="18px" width="40%" />
                <Skeleton variant="text" height="14px" width="20%" />
              </div>
              <Skeleton variant="text" height="24px" width="85%" />
              <Skeleton variant="text" height="16px" width="100%" />
              <Skeleton variant="text" height="16px" width="60%" />
            </div>
          ))}
        </div>
      ) : filteredIncidents.length === 0 ? (
        <div className="glass-panel rounded-xl p-12 text-center max-w-md mx-auto my-8 space-y-3">
          <span className="text-4xl block">📋</span>
          <h3 className="text-base font-bold text-slate-200">No Incidents Found</h3>
          <p className="text-xs text-slate-400">
            No incidents match the selected severity and status filters.
          </p>
          {(selectedSeverity !== 'all' || activeTab !== 'all') && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSelectedSeverity('all')
                setActiveTab('all')
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredIncidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      )}
    </div>
  )
}
