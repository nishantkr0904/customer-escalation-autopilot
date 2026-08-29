'use client'

import React from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const QuickActions: React.FC = () => {
  return (
    <Card title="Quick Actions" description="Trigger common triage and monitoring workflows">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <Link href="/workflow" className="w-full">
          <Button variant="primary" size="md" className="w-full justify-start gap-2">
            <span>⚡</span>
            <span>Process New Incident</span>
          </Button>
        </Link>

        <Link href="/health" className="w-full">
          <Button variant="secondary" size="md" className="w-full justify-start gap-2">
            <span>💚</span>
            <span>Check Service Health</span>
          </Button>
        </Link>
      </div>
    </Card>
  )
}
