'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Incident } from '@/lib/types'
import { IncidentDetailLayout } from '@/components/incidents/incident-detail'

export default function IncidentDetailPage({ params }: { params: { id: string } }) {
  const [incident, setIncident] = useState<Incident | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchIncident = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      setNotFound(false)
      const res = await fetch(`/api/incidents/${params.id}`)
      if (res.status === 404) {
        setNotFound(true)
        return
      }
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const data = await res.json()
      if (data.incident) {
        setIncident(data.incident)
      } else {
        setNotFound(true)
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    fetchIncident()
  }, [fetchIncident])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" height="24px" width="30%" />
        <Skeleton variant="text" height="40px" width="70%" />
        <Skeleton variant="card" height="120px" width="100%" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton variant="card" height="220px" width="100%" />
            <Skeleton variant="card" height="300px" width="100%" />
          </div>
          <div className="space-y-6">
            <Skeleton variant="card" height="250px" width="100%" />
            <Skeleton variant="card" height="250px" width="100%" />
          </div>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="glass-panel rounded-xl p-12 text-center max-w-md mx-auto my-12 space-y-4">
        <span className="text-4xl block">🔍</span>
        <h2 className="text-lg font-bold text-slate-100">Incident Not Found</h2>
        <p className="text-xs text-slate-400">
          No incident record matches ID &quot;{params.id}&quot;.
        </p>
        <Link href="/incidents">
          <Button variant="primary" size="sm">
            ← Back to Incidents List
          </Button>
        </Link>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel rounded-xl p-8 text-center max-w-md mx-auto my-12 space-y-4 border-red-500/30">
        <span className="text-3xl block">⚠️</span>
        <h2 className="text-base font-bold text-red-400">Failed to Load Incident</h2>
        <p className="text-xs text-slate-400">{error}</p>
        <Button variant="secondary" size="sm" onClick={fetchIncident}>
          Retry
        </Button>
      </div>
    )
  }

  return incident ? <IncidentDetailLayout incident={incident} /> : null
}
