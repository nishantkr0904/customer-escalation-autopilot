'use client'

import React from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Incident } from '@/lib/types'
import { formatRelativeTime } from '@/lib/utils/formatters'

interface RecentIncidentsProps {
  incidents: Incident[]
  loading?: boolean
}

export const RecentIncidents: React.FC<RecentIncidentsProps> = ({
  incidents,
  loading,
}) => {
  if (loading) {
    return (
      <Card title="Recent Incidents" description="Latest customer escalation reports">
        <div className="space-y-3 pt-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="text" height="40px" width="100%" />
          ))}
        </div>
      </Card>
    )
  }

  const recentList = incidents.slice(0, 5)

  return (
    <Card
      title="Recent Incidents"
      description="Latest customer escalation reports in the pipeline"
      headerAction={
        <Link
          href="/incidents"
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View All →
        </Link>
      }
    >
      {recentList.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500">
          No incidents recorded yet. Use Quick Actions to process a new report.
        </div>
      ) : (
        <div className="overflow-x-auto -mx-5 -mb-5">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 text-slate-400 font-semibold uppercase tracking-wider bg-slate-950/40">
                <th className="py-3 px-5">Incident</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-5 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {recentList.map((inc) => (
                <tr
                  key={inc.id}
                  className="group hover:bg-slate-800/40 transition-colors duration-150 cursor-pointer"
                >
                  <td className="py-3.5 px-5 max-w-[220px]">
                    <Link href={`/incidents/${inc.id}`} className="block truncate font-medium text-slate-200 group-hover:text-indigo-300">
                      {inc.title}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                    {inc.customer ? (
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold">{inc.customer.name}</span>
                        <span className="text-[10px] text-slate-500 uppercase">({inc.customer.tier})</span>
                      </div>
                    ) : (
                      <span className="text-slate-500 italic">Unknown</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Badge level={inc.severity || 'medium'} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Badge status={inc.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-5 text-right text-slate-400 whitespace-nowrap text-[11px]">
                    {formatRelativeTime(inc.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}
