'use client'

import React from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Incident } from '@/lib/types'
import { WorkflowStepCard } from './workflow-step'
import { formatDuration } from '@/lib/utils/formatters'

interface PipelineViewProps {
  incident: Incident
}

export const PipelineView: React.FC<PipelineViewProps> = ({ incident }) => {
  const steps = incident.workflowState?.steps || []
  const overallStatus = incident.workflowState?.overallStatus || 'running'
  const totalDuration = incident.workflowState?.totalDurationMs

  const completedCount = steps.filter((s) => s.status === 'completed').length
  const failedCount = steps.filter((s) => s.status === 'failed').length
  const totalCount = steps.length

  return (
    <div className="space-y-6">
      {/* Pipeline Visual Header */}
      <Card
        title={
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span>⚡</span>
              <span className="font-bold text-slate-100">Live Workflow Execution Pipeline</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Incident ID: {incident.id}</span>
              {overallStatus === 'completed' && (
                <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Pipeline Completed
                </span>
              )}
              {overallStatus === 'running' && (
                <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 animate-pulse">
                  Pipeline Running
                </span>
              )}
              {overallStatus === 'failed' && (
                <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                  Pipeline Failed
                </span>
              )}
            </div>
          </div>
        }
        description={`Target Incident: "${incident.title}" (${incident.customer ? incident.customer.name : 'Unknown Customer'})`}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1">
          <div>
            <span className="text-slate-400 block text-[11px]">Total Pipeline Steps</span>
            <span className="font-bold text-slate-100 text-sm mt-0.5 block">{totalCount} Steps</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Completed Steps</span>
            <span className="font-bold text-emerald-400 text-sm mt-0.5 block">
              {completedCount} / {totalCount}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Failed Steps</span>
            <span className={`font-bold text-sm mt-0.5 block ${failedCount > 0 ? 'text-red-400' : 'text-slate-200'}`}>
              {failedCount}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">Total Execution Time</span>
            <span className="font-bold text-indigo-400 text-sm mt-0.5 block font-mono">
              {totalDuration ? formatDuration(totalDuration) : 'In progress...'}
            </span>
          </div>
        </div>
      </Card>

      {/* Stepped Pipeline Cards with Connecting Flow Lines */}
      <div className="relative space-y-3">
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1
          const nextStep = steps[idx + 1]

          // Connector line style
          let lineStyle = 'border-slate-800'
          if (step.status === 'completed' && nextStep && nextStep.status === 'completed') {
            lineStyle = 'border-emerald-500/50'
          } else if (step.status === 'completed' && nextStep && nextStep.status === 'running') {
            lineStyle = 'border-sky-500 animate-pulse'
          }

          return (
            <React.Fragment key={step.id}>
              <WorkflowStepCard step={step} index={idx} />
              {!isLast && (
                <div className="flex justify-center py-1">
                  <div className={`h-4 w-0 border-r-2 border-dashed ${lineStyle}`} />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Pipeline Completion Summary Card */}
      {overallStatus !== 'running' && (
        <Card className="border-indigo-500/30 bg-indigo-950/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2">
            <div>
              <h4 className="text-sm font-bold text-indigo-300">
                Workflow Orchestration Concluded
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                Incident classified as <strong className="uppercase text-slate-100">{incident.severity || 'MEDIUM'}</strong> severity.
                {incident.escalation ? ' Automated escalation actions dispatched.' : ' Held in standard queue.'}
              </p>
            </div>
            <Link
              href={`/incidents/${incident.id}`}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-xs transition-colors shrink-0 text-center"
            >
              View Full Incident Detail →
            </Link>
          </div>
        </Card>
      )}
    </div>
  )
}
