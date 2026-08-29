'use client'

import React from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Incident } from '@/lib/types'
import { formatRelativeTime, truncateText } from '@/lib/utils/formatters'

interface IncidentCardProps {
  incident: Incident
}

export const IncidentCard: React.FC<IncidentCardProps> = ({ incident }) => {
  return (
    <Link href={`/incidents/${incident.id}`} className="block h-full">
      <Card className="h-full flex flex-col justify-between hover:border-indigo-500/50 transition-all duration-200">
        <div>
          {/* Header Badges & Time */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge level={incident.severity || 'medium'} size="sm" />
              <Badge status={incident.status} size="sm" />
            </div>
            <span className="text-[11px] text-slate-400 font-mono shrink-0">
              {formatRelativeTime(incident.createdAt)}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-slate-100 line-clamp-2 leading-snug mb-2 group-hover:text-indigo-300">
            {incident.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-400 line-clamp-2 mb-4">
            {truncateText(incident.description, 110)}
          </p>
        </div>

        {/* Footer info: Customer & Source */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 mt-auto">
          {incident.customer ? (
            <div className="flex items-center gap-1.5 truncate">
              <span className="font-medium text-slate-200 truncate">{incident.customer.name}</span>
              <span className="text-[10px] text-indigo-400 font-semibold uppercase px-1.5 py-0.2 rounded bg-indigo-500/10 border border-indigo-500/20">
                {incident.customer.tier}
              </span>
            </div>
          ) : (
            <span className="italic text-slate-500 text-[11px]">Unassigned customer</span>
          )}

          <span className="text-xs shrink-0 pl-2">
            {incident.source === 'slack' ? '💬 Slack' : '📝 Manual'}
          </span>
        </div>
      </Card>
    </Link>
  )
}
