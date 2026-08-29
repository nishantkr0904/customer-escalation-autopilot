import React from 'react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

export default function DashboardPlaceholder() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100">Dashboard</h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-time incident triage and automated escalation overview
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Total Incidents" description="All recorded incidents">
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-indigo-400">12</span>
            <Badge level="low">Active</Badge>
          </div>
        </Card>

        <Card title="Critical Escalations" description="High severity events">
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-red-400">3</span>
            <Badge level="critical">Critical</Badge>
          </div>
        </Card>

        <Card title="Avg Triage Speed" description="Pipeline processing time">
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-emerald-400">4.2s</span>
            <span className="text-xs text-slate-400">Sub-minute</span>
          </div>
        </Card>

        <Card title="Connected Adapters" description="Integration health">
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-purple-400">8 / 8</span>
            <span className="text-xs text-emerald-400">100% Up</span>
          </div>
        </Card>
      </div>

      <Card title="System Initializing" description="Loading metrics skeleton">
        <div className="space-y-3 pt-2">
          <Skeleton variant="text" height="20px" width="60%" />
          <Skeleton variant="text" height="16px" width="80%" />
          <Skeleton variant="text" height="16px" width="40%" />
        </div>
      </Card>
    </div>
  )
}
