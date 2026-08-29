'use client'

import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Incident } from '@/lib/types'
import { formatDuration } from '@/lib/utils/formatters'

interface StatsGridProps {
  incidents: Incident[]
  loading?: boolean
}

function useAnimatedNumber(target: number, duration: number = 800) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    let startTimestamp: number | null = null
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      setCurrent(Math.floor(progress * target))
      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }
    window.requestAnimationFrame(step)
  }, [target, duration])

  return current
}

function MetricValue({ value }: { value: number }) {
  const animatedValue = useAnimatedNumber(value)
  return <span>{animatedValue}</span>
}

export const StatsGrid: React.FC<StatsGridProps> = ({ incidents, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <div className="space-y-3">
              <Skeleton variant="text" height="14px" width="40%" />
              <Skeleton variant="text" height="32px" width="60%" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  const totalIncidents = incidents.length
  const criticalCount = incidents.filter((i) => i.severity === 'critical').length
  const activeEscalations = incidents.filter((i) => i.status === 'escalated').length

  const durations = incidents
    .map((i) => i.workflowState?.totalDurationMs)
    .filter((d): d is number => typeof d === 'number' && d > 0)

  const avgDurationMs =
    durations.length > 0
      ? Math.round(durations.reduce((acc, curr) => acc + curr, 0) / durations.length)
      : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Incidents */}
      <Card
        title={
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>Total Incidents</span>
            <span className="text-lg">🚨</span>
          </div>
        }
      >
        <div className="mt-1 flex items-baseline justify-between">
          <span className="text-3xl font-bold text-indigo-400">
            <MetricValue value={totalIncidents} />
          </span>
          <span className="text-[11px] text-slate-500 font-medium">All recorded</span>
        </div>
      </Card>

      {/* Critical Count */}
      <Card
        title={
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>Critical Severity</span>
            <span className="text-lg">🔴</span>
          </div>
        }
      >
        <div className="mt-1 flex items-baseline justify-between">
          <span className="text-3xl font-bold text-red-400">
            <MetricValue value={criticalCount} />
          </span>
          <span className="text-[11px] text-red-400/80 font-medium font-mono">Requires action</span>
        </div>
      </Card>

      {/* Avg Response Time */}
      <Card
        title={
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>Avg Response Time</span>
            <span className="text-lg">⚡</span>
          </div>
        }
      >
        <div className="mt-1 flex items-baseline justify-between">
          <span className="text-3xl font-bold text-amber-400">
            {formatDuration(avgDurationMs)}
          </span>
          <span className="text-[11px] text-emerald-400 font-medium">Sub-minute</span>
        </div>
      </Card>

      {/* Active Escalations */}
      <Card
        title={
          <div className="flex items-center justify-between text-xs font-medium text-slate-400">
            <span>Active Escalations</span>
            <span className="text-lg">📢</span>
          </div>
        }
      >
        <div className="mt-1 flex items-baseline justify-between">
          <span className="text-3xl font-bold text-orange-400">
            <MetricValue value={activeEscalations} />
          </span>
          <span className="text-[11px] text-orange-400/80 font-medium">In flight</span>
        </div>
      </Card>
    </div>
  )
}
