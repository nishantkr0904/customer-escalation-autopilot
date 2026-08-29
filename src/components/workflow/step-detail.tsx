'use client'

import React from 'react'
import { WorkflowStep } from '@/lib/types'
import { formatDuration } from '@/lib/utils/formatters'

interface StepDetailProps {
  step: WorkflowStep
}

export const StepDetailPanel: React.FC<StepDetailProps> = ({ step }) => {
  return (
    <div className="mt-3 pt-3 border-t border-slate-800 text-xs space-y-2 bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/80 animate-fade-in">
      <div className="text-slate-300 font-medium">
        <span className="text-slate-400 font-semibold block text-[11px] mb-0.5 uppercase tracking-wider">
          Step Description
        </span>
        {step.description}
      </div>

      {step.output && (
        <div>
          <span className="text-indigo-300 font-semibold block text-[11px] mb-0.5 uppercase tracking-wider">
            Output Data
          </span>
          <pre className="font-mono text-[11px] text-emerald-300 bg-slate-900 p-2.5 rounded border border-slate-800 whitespace-pre-wrap overflow-x-auto">
            {step.output}
          </pre>
        </div>
      )}

      {step.error && (
        <div>
          <span className="text-red-400 font-semibold block text-[11px] mb-0.5 uppercase tracking-wider">
            Error Diagnostic
          </span>
          <pre className="font-mono text-[11px] text-red-400 bg-red-500/10 p-2.5 rounded border border-red-500/20 whitespace-pre-wrap">
            {step.error}
          </pre>
        </div>
      )}

      <div className="flex flex-wrap gap-4 text-[10px] text-slate-400 font-mono pt-1">
        {step.startedAt && <span>Started: {new Date(step.startedAt).toLocaleTimeString()}</span>}
        {step.completedAt && <span>Completed: {new Date(step.completedAt).toLocaleTimeString()}</span>}
        {step.durationMs !== null && step.durationMs !== undefined && (
          <span className="text-indigo-400">Execution Duration: {formatDuration(step.durationMs)}</span>
        )}
      </div>
    </div>
  )
}
