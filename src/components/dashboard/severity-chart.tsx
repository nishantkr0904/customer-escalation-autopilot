'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Incident, SeverityLevel } from '@/lib/types'

interface SeverityChartProps {
  incidents: Incident[]
  loading?: boolean
}

export const SeverityChart: React.FC<SeverityChartProps> = ({
  incidents,
  loading,
}) => {
  if (loading) {
    return (
      <Card title="Severity Distribution" description="Incident count by severity level">
        <div className="space-y-3 pt-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} variant="text" height="24px" width="100%" />
          ))}
        </div>
      </Card>
    )
  }

  const counts: Record<SeverityLevel, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  }

  for (const inc of incidents) {
    const sev = inc.severity || 'medium'
    counts[sev] = (counts[sev] || 0) + 1
  }

  const total = incidents.length

  const levels: { level: SeverityLevel; label: string; colorClass: string; bgClass: string }[] = [
    { level: 'critical', label: 'Critical', colorClass: 'text-red-400', bgClass: 'bg-red-500' },
    { level: 'high', label: 'High', colorClass: 'text-orange-400', bgClass: 'bg-orange-500' },
    { level: 'medium', label: 'Medium', colorClass: 'text-amber-400', bgClass: 'bg-amber-500' },
    { level: 'low', label: 'Low', colorClass: 'text-emerald-400', bgClass: 'bg-emerald-500' },
  ]

  return (
    <Card title="Severity Distribution" description="Incidents categorized by technical severity">
      {total === 0 ? (
        <div className="py-6 text-center text-xs text-slate-500">
          No severity data available
        </div>
      ) : (
        <div className="space-y-3.5 pt-1">
          {levels.map(({ level, label, colorClass, bgClass }) => {
            const count = counts[level]
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0

            return (
              <div key={level} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className={`font-semibold ${colorClass}`}>{label}</span>
                  <span className="text-slate-400 font-mono">
                    {count} ({percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-slate-700/50">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${bgClass}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
