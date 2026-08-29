'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { StatusIndicator } from '@/components/ui/status-indicator'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { HealthCheckResponse, ServiceHealthStatus } from '@/lib/types'
import { formatRelativeTime } from '@/lib/utils/formatters'

interface HealthApiResponse {
  status: 'operational' | 'degraded' | 'down'
  checkedAt: string
  servicesCount: number
  services: HealthCheckResponse[]
}

const serviceIcons: Record<string, string> = {
  hubspot: '👤',
  stripe: '💳',
  github: '🔧',
  linear: '🎫',
  slack: '📢',
  notion: '📓',
  email: '📧',
  gemini: '🤖',
}

export default function HealthPage() {
  const [data, setData] = useState<HealthApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(30)

  const fetchHealth = useCallback(async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true)
      setError(null)
      const res = await fetch('/api/health')
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const json: HealthApiResponse = await res.json()
      setData(json)
      setCountdown(30)
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      setError(errorMsg)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchHealth()
  }, [fetchHealth])

  // 30-second auto refresh & 1-second countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchHealth()
          return 30
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [fetchHealth])

  // System status banner styling
  let bannerBg = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
  let bannerTitle = 'All Systems Operational'
  let bannerIcon = '🟢'

  if (data?.status === 'degraded') {
    bannerBg = 'bg-amber-500/10 border-amber-500/30 text-amber-300'
    bannerTitle = 'Partial System Degradation'
    bannerIcon = '🟡'
  } else if (data?.status === 'down') {
    bannerBg = 'bg-red-500/10 border-red-500/30 text-red-300'
    bannerTitle = 'Major System Outage'
    bannerIcon = '🔴'
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Service Health & SLA Observability</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time availability monitoring and response time health checks for all 8 system integrations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-mono">
            Auto-refresh in: <strong className="text-indigo-400">{countdown}s</strong>
          </span>
          <Button
            variant="secondary"
            size="sm"
            loading={refreshing}
            onClick={() => fetchHealth(true)}
          >
            <span>🔄</span> Refresh Now
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex justify-between items-center">
          <span>Failed to fetch health check metrics: {error}</span>
          <Button variant="secondary" size="sm" onClick={() => fetchHealth(true)}>
            Retry
          </Button>
        </div>
      )}

      {/* Overall Status Banner */}
      {loading ? (
        <Skeleton variant="card" height="72px" width="100%" />
      ) : data ? (
        <div className={`p-4 rounded-xl border ${bannerBg} flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-glass`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl leading-none">{bannerIcon}</span>
            <div>
              <h2 className="text-sm font-bold tracking-tight">{bannerTitle}</h2>
              <p className="text-xs opacity-80 mt-0.5">
                Monitoring {data.servicesCount} integration adapters • Last checked:{' '}
                {new Date(data.checkedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="text-xs font-mono opacity-90 sm:text-right">
            <span>Uptime SLA: 99.9%</span>
          </div>
        </div>
      ) : null}

      {/* 8 Services Health Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? [...Array(8)].map((_, i) => (
              <Card key={i}>
                <div className="space-y-3">
                  <Skeleton variant="text" height="20px" width="60%" />
                  <Skeleton variant="text" height="16px" width="40%" />
                  <Skeleton variant="text" height="12px" width="80%" />
                </div>
              </Card>
            ))
          : data?.services.map((svc) => {
              const icon = serviceIcons[svc.service] || '⚡'

              // Response time color
              let rtColor = 'text-emerald-400'
              if (svc.responseTimeMs && svc.responseTimeMs > 1000) {
                rtColor = 'text-red-400'
              } else if (svc.responseTimeMs && svc.responseTimeMs > 200) {
                rtColor = 'text-amber-400'
              }

              return (
                <Card
                  key={svc.service}
                  title={
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{icon}</span>
                        <span className="font-bold text-slate-100">{svc.displayName}</span>
                      </div>
                      <StatusIndicator
                        status={svc.status as ServiceHealthStatus}
                        showLabel={false}
                        size="sm"
                      />
                    </div>
                  }
                  description={`Service: ${svc.service}`}
                >
                  <div className="space-y-3 text-xs pt-1">
                    {/* Status & Response Time */}
                    <div className="flex justify-between items-baseline">
                      <span className="text-slate-400">Response Time</span>
                      <span className={`font-mono font-bold ${rtColor}`}>
                        {svc.responseTimeMs !== null ? `${svc.responseTimeMs}ms` : 'N/A'}
                      </span>
                    </div>

                    {/* Uptime % with Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-baseline text-[11px]">
                        <span className="text-slate-400">Uptime</span>
                        <span className="font-mono text-slate-200 font-semibold">{svc.uptime}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-emerald-400 rounded-full"
                          style={{ width: `${svc.uptime}%` }}
                        />
                      </div>
                    </div>

                    {/* Error message if degraded or down */}
                    {svc.error && (
                      <div className="p-2 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono leading-snug">
                        Error: {svc.error}
                      </div>
                    )}

                    {/* Metadata items */}
                    {svc.metadata && Object.keys(svc.metadata).length > 0 && (
                      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-400">
                        {Object.entries(svc.metadata).map(([key, val]) => (
                          <span key={key}>
                            <span className="text-slate-500">{key}:</span>{' '}
                            <span className="font-mono text-slate-300">{String(val)}</span>
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Last Checked */}
                    <div className="text-[10px] text-slate-500 text-right pt-1 font-mono">
                      Checked {formatRelativeTime(svc.lastChecked)}
                    </div>
                  </div>
                </Card>
              )
            })}
      </div>
    </div>
  )
}
