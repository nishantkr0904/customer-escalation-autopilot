'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { EscalationResult } from '@/lib/types'

interface EscalationActionsProps {
  escalation: EscalationResult | null
  shouldEscalate?: boolean
}

export const EscalationActionsCard: React.FC<EscalationActionsProps> = ({
  escalation,
  shouldEscalate = true,
}) => {
  if (!escalation) {
    return (
      <Card title="Escalation Workflows" description="Automated Dispatch Sequence">
        <div className="py-6 text-center text-xs text-slate-500 italic">
          {shouldEscalate
            ? 'Escalation actions sequence in progress...'
            : 'Escalation threshold not triggered. Held in standard support queue.'}
        </div>
      </Card>
    )
  }

  const actionIcons: Record<string, string> = {
    create_linear_ticket: '🎫',
    notify_slack: '📢',
    generate_summary: '📋',
    update_notion: '📓',
    send_email: '📧',
  }

  const actionLabels: Record<string, string> = {
    create_linear_ticket: 'Create Linear Ticket',
    notify_slack: 'Notify Engineering Slack',
    generate_summary: 'Generate Executive Summary',
    update_notion: 'Update Notion Incident Log',
    send_email: 'Send Executive Summary Email',
  }

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>⚡</span>
            <span className="font-bold text-slate-100">Automated Escalation Actions</span>
          </div>
          {escalation.partialFailure ? (
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Partial Success
            </span>
          ) : (
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              All Actions Success
            </span>
          )}
        </div>
      }
      description={escalation.reason}
    >
      <div className="space-y-3 pt-1 text-xs">
        {/* Ticket Link Banner */}
        {escalation.linearTicket && (
          <div className="p-3 rounded-lg bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">🎫</span>
              <div>
                <span className="font-bold text-indigo-300">
                  {escalation.linearTicket.identifier}
                </span>
                <span className="text-slate-400 text-[11px] block">
                  {escalation.linearTicket.title}
                </span>
              </div>
            </div>
            <a
              href={escalation.linearTicket.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-semibold transition-colors"
            >
              Open Ticket ↗
            </a>
          </div>
        )}

        {/* Actions List */}
        <div className="divide-y divide-slate-800/80 rounded-lg border border-slate-800 bg-slate-900/60 overflow-hidden">
          {escalation.actions.map((act, idx) => {
            let statusBadge = (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span>✓</span>
                <span>Success</span>
              </span>
            )
            if (act.status === 'failed') {
              statusBadge = (
                <span className="text-red-400 font-bold flex items-center gap-1">
                  <span>✗</span>
                  <span>Failed</span>
                </span>
              )
            } else if (act.status === 'skipped') {
              statusBadge = (
                <span className="text-slate-500 font-bold flex items-center gap-1">
                  <span>⏭️</span>
                  <span>Skipped</span>
                </span>
              )
            }

            return (
              <div key={idx} className="p-3 flex items-center justify-between gap-4">
                <div className="flex items-start gap-2.5">
                  <span className="text-base mt-0.5">{actionIcons[act.action] || '⚡'}</span>
                  <div>
                    <span className="font-semibold text-slate-200 block">
                      {actionLabels[act.action] || act.action}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {act.message}
                    </span>
                    {act.error && (
                      <span className="text-[10px] text-red-400 block mt-0.5 font-mono">
                        Error: {act.error}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {statusBadge}
                  <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                    {act.durationMs}ms
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
