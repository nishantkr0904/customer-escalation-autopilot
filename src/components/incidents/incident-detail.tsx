'use client'

import React from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Incident } from '@/lib/types'
import { CustomerContextCard } from './customer-context'
import { AIReasoningCard } from './ai-reasoning'
import { EscalationActionsCard } from './escalation-actions'
import { ExecSummaryCard } from './exec-summary'
import { IncidentTimelineCard } from './incident-timeline'

interface IncidentDetailProps {
  incident: Incident
}

export const IncidentDetailLayout: React.FC<IncidentDetailProps> = ({ incident }) => {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <Link
          href="/incidents"
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1 mb-2"
        >
          ← Back to Incidents
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <Badge level={incident.severity || 'medium'} />
              <Badge status={incident.status} />
              <span className="text-xs text-slate-400 font-mono">ID: {incident.id}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-100">{incident.title}</h1>
          </div>
          <div className="text-xs text-slate-400 font-mono shrink-0">
            Created: {new Date(incident.createdAt).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Primary Description Card */}
      <Card title="Incident Description" description={`Reported via ${incident.source.toUpperCase()}`}>
        <p className="text-xs text-slate-200 leading-relaxed font-mono bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
          {incident.description}
        </p>
      </Card>

      {/* Main Two-Column Layout (Main Left / Sidebar Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column (Left - 2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <CustomerContextCard customer={incident.customer} />
          <AIReasoningCard decision={incident.aiDecision} />
          <EscalationActionsCard
            escalation={incident.escalation}
            shouldEscalate={incident.aiDecision?.shouldEscalate ?? true}
          />
        </div>

        {/* Sidebar Column (Right - 1 Col) */}
        <div className="space-y-6">
          <ExecSummaryCard summary={incident.executiveSummary} />
          <IncidentTimelineCard timeline={incident.timeline} />
        </div>
      </div>
    </div>
  )
}
