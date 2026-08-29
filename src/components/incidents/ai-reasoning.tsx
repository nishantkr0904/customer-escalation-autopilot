'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AIDecision } from '@/lib/types'

interface AIReasoningProps {
  decision: AIDecision | null
}

export const AIReasoningCard: React.FC<AIReasoningProps> = ({ decision }) => {
  if (!decision) {
    return (
      <Card title="AI Reasoning Engine (Gemini 3.7 Flash)" description="AI Severity Assessment">
        <div className="py-6 text-center text-xs text-slate-500 italic flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4 text-indigo-400" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>AI incident analysis in progress...</span>
        </div>
      </Card>
    )
  }

  const confidencePct = Math.round(decision.confidence * 100)

  // Confidence bar color
  let confColor = 'bg-emerald-500 text-emerald-400'
  if (confidencePct < 50) {
    confColor = 'bg-red-500 text-red-400'
  } else if (confidencePct < 80) {
    confColor = 'bg-amber-500 text-amber-400'
  }

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>🤖</span>
            <span className="font-bold text-slate-100">AI Triage Reasoning</span>
          </div>
          <Badge level={decision.severity} />
        </div>
      }
      description={`Model: ${decision.model} • Latency: ${decision.latencyMs}ms • Tokens: ${decision.tokensUsed}`}
    >
      <div className="space-y-4 text-xs pt-1">
        {/* Confidence Meter */}
        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-4">
          <span className="font-semibold text-slate-300">Confidence Score</span>
          <div className="flex items-center gap-3 flex-1 max-w-xs">
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/50">
              <div
                className={`h-full rounded-full ${confColor.split(' ')[0]}`}
                style={{ width: `${confidencePct}%` }}
              />
            </div>
            <span className={`font-mono font-bold ${confColor.split(' ')[1]}`}>
              {confidencePct}%
            </span>
          </div>
        </div>

        {/* Reasoning Text */}
        <div>
          <h4 className="font-semibold text-slate-200 mb-1">Reasoning Breakdown</h4>
          <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
            {decision.reasoning}
          </p>
        </div>

        {/* Business Impact & Technical Assessment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <h5 className="font-semibold text-indigo-300 mb-1 flex items-center gap-1.5">
              <span>💼</span> Business Impact
            </h5>
            <p className="text-slate-300 text-[11px] leading-normal">{decision.businessImpact}</p>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <h5 className="font-semibold text-indigo-300 mb-1 flex items-center gap-1.5">
              <span>🔧</span> Technical Assessment
            </h5>
            <p className="text-slate-300 text-[11px] leading-normal">{decision.technicalAssessment}</p>
          </div>
        </div>

        {/* Recommended Actions */}
        {decision.recommendedActions && decision.recommendedActions.length > 0 && (
          <div>
            <h4 className="font-semibold text-slate-200 mb-1.5">Recommended Actions</h4>
            <ul className="space-y-1">
              {decision.recommendedActions.map((action, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-300 text-[11px]">
                  <span className="text-indigo-400 font-bold">✓</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risk Factors */}
        {decision.riskFactors && decision.riskFactors.length > 0 && (
          <div>
            <h4 className="font-semibold text-slate-200 mb-1.5">Identified Risk Factors</h4>
            <div className="flex flex-wrap gap-1.5">
              {decision.riskFactors.map((risk, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px]"
                >
                  <span>⚠️</span>
                  <span>{risk}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
