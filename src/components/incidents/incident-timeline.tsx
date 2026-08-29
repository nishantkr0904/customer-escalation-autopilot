'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { TimelineEvent } from '@/lib/types'
import { formatRelativeTime } from '@/lib/utils/formatters'

interface IncidentTimelineProps {
  timeline: TimelineEvent[]
}

export const IncidentTimelineCard: React.FC<IncidentTimelineProps> = ({ timeline }) => {
  if (!timeline || timeline.length === 0) {
    return (
      <Card title="Incident Lifecycle Timeline" description="Chronological Event Stream">
        <div className="py-6 text-center text-xs text-slate-500 italic">
          No timeline events recorded yet.
        </div>
      </Card>
    )
  }

  // Sort events chronologically (oldest first or newest top)
  const sortedEvents = [...timeline].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <span>⏱️</span>
          <span className="font-bold text-slate-100">Incident Lifecycle Timeline</span>
        </div>
      }
      description="Chronological history of workflow execution and context enrichment"
    >
      <div className="relative pl-4 space-y-4 pt-2 text-xs before:absolute before:left-[7px] before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
        {sortedEvents.map((evt, idx) => {
          let dotColor = 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
          if (evt.status === 'error') {
            dotColor = 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.6)]'
          } else if (evt.status === 'warning') {
            dotColor = 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
          }

          return (
            <div key={evt.id || idx} className="relative flex items-start gap-3 group">
              {/* Dot */}
              <span
                className={`absolute -left-[13px] top-1 h-2.5 w-2.5 rounded-full border-2 border-slate-950 ${dotColor} transition-transform duration-200 group-hover:scale-125`}
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h5 className="font-bold text-slate-200 text-xs">{evt.title}</h5>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {formatRelativeTime(evt.timestamp)}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] mt-0.5 leading-normal">
                  {evt.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
