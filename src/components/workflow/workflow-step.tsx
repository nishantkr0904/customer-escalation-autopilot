'use client'

import React, { useState } from 'react'
import { WorkflowStep as WorkflowStepType } from '@/lib/types'
import { StepDetailPanel } from './step-detail'
import { formatDuration } from '@/lib/utils/formatters'

interface WorkflowStepProps {
  step: WorkflowStepType
  index: number
}

export const WorkflowStepCard: React.FC<WorkflowStepProps> = ({ step, index }) => {
  const [expanded, setExpanded] = useState(false)

  // Status visual configurations
  let statusBadge = (
    <span className="text-slate-400 bg-slate-800 border-slate-700/80 px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border">
      <span className="h-2 w-2 rounded-full bg-slate-400" />
      <span>Pending</span>
    </span>
  )
  let cardBorder = 'border-slate-800/80 bg-slate-900/60'

  if (step.status === 'running') {
    statusBadge = (
      <span className="text-sky-300 bg-sky-500/15 border-sky-500/40 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border animate-pulse">
        <svg className="animate-spin h-3 w-3 text-sky-400" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span>Processing...</span>
      </span>
    )
    cardBorder = 'border-sky-500/50 bg-sky-950/20 shadow-[0_0_15px_rgba(14,165,233,0.15)]'
  } else if (step.status === 'completed') {
    statusBadge = (
      <span className="text-emerald-400 bg-emerald-500/10 border-emerald-500/30 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border">
        <span>✓</span>
        <span>Completed</span>
      </span>
    )
    cardBorder = 'border-emerald-500/30 bg-slate-900/80'
  } else if (step.status === 'failed') {
    statusBadge = (
      <span className="text-red-400 bg-red-500/15 border-red-500/40 px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border">
        <span>✗</span>
        <span>Failed</span>
      </span>
    )
    cardBorder = 'border-red-500/40 bg-red-950/10'
  } else if (step.status === 'skipped') {
    statusBadge = (
      <span className="text-slate-500 bg-slate-800/40 border-slate-700/40 px-2 py-0.5 rounded-full text-xs italic flex items-center gap-1 border">
        <span>⏭️</span>
        <span>Skipped</span>
      </span>
    )
    cardBorder = 'border-slate-800/40 bg-slate-950/40 opacity-70'
  }

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer hover:border-indigo-500/50 ${cardBorder}`}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Step Icon, Index & Name */}
        <div className="flex items-center gap-3">
          <span className="text-xl shrink-0 leading-none">{step.icon || '⚡'}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400 font-semibold">
                Step {index + 1}
              </span>
              <h4 className="text-xs font-bold text-slate-100">{step.name}</h4>
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{step.description}</p>
          </div>
        </div>

        {/* Right Status Badge, Timing & Expand Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          {step.durationMs !== null && step.durationMs !== undefined && (
            <span className="text-[11px] font-mono text-slate-400 hidden sm:inline-block">
              {formatDuration(step.durationMs)}
            </span>
          )}
          {statusBadge}
          <span className="text-slate-500 text-xs font-mono ml-1">
            {expanded ? '▲' : '▼'}
          </span>
        </div>
      </div>

      {/* Expandable Step Output Panel */}
      {expanded && <StepDetailPanel step={step} />}
    </div>
  )
}
