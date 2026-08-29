'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { ExecutiveSummary } from '@/lib/types'

interface ExecSummaryProps {
  summary: ExecutiveSummary | null
}

export const ExecSummaryCard: React.FC<ExecSummaryProps> = ({ summary }) => {
  if (!summary) {
    return (
      <Card title="Executive Brief" description="Stakeholder Summary">
        <div className="py-6 text-center text-xs text-slate-500 italic">
          Executive summary pending completion of triage analysis.
        </div>
      </Card>
    )
  }

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>📋</span>
            <span className="font-bold text-slate-100">Executive Summary</span>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
            {summary.generatedBy}
          </span>
        </div>
      }
      description={`Generated at: ${new Date(summary.generatedAt).toLocaleTimeString()}`}
    >
      <div className="space-y-3.5 text-xs pt-1">
        {/* Headline */}
        <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-bold text-slate-200 text-xs">
          {summary.title}
        </div>

        {/* Customer Impact */}
        <div>
          <h5 className="font-semibold text-slate-300 mb-1 text-[11px] uppercase tracking-wider">
            Customer Impact
          </h5>
          <p className="text-slate-300 leading-normal bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 text-[11px]">
            {summary.customerImpact}
          </p>
        </div>

        {/* Technical Summary */}
        <div>
          <h5 className="font-semibold text-slate-300 mb-1 text-[11px] uppercase tracking-wider">
            Technical Overview
          </h5>
          <p className="text-slate-300 leading-normal bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 text-[11px]">
            {summary.technicalSummary}
          </p>
        </div>

        {/* Actions Taken */}
        {summary.actionsTaken && summary.actionsTaken.length > 0 && (
          <div>
            <h5 className="font-semibold text-slate-300 mb-1 text-[11px] uppercase tracking-wider">
              Actions Executed
            </h5>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px]">
              {summary.actionsTaken.map((act, idx) => (
                <li key={idx}>{act}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Recommended Next Steps */}
        {summary.recommendedNextSteps && summary.recommendedNextSteps.length > 0 && (
          <div>
            <h5 className="font-semibold text-slate-300 mb-1 text-[11px] uppercase tracking-wider">
              Recommended Next Steps
            </h5>
            <ul className="list-disc list-inside space-y-1 text-indigo-300 text-[11px]">
              {summary.recommendedNextSteps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Risk Assessment */}
        <div>
          <h5 className="font-semibold text-amber-400 mb-1 text-[11px] uppercase tracking-wider">
            Risk Assessment
          </h5>
          <p className="text-amber-300/90 leading-normal bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 text-[11px]">
            {summary.riskAssessment}
          </p>
        </div>
      </div>
    </Card>
  )
}
