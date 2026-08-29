'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { NewIncidentForm } from '../incidents/new-incident-form'

export const QuickActions: React.FC = () => {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <Card title="Quick Actions" description="Trigger common triage and monitoring workflows">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <Button
            variant="primary"
            size="md"
            className="w-full justify-start gap-2"
            onClick={() => setShowModal(true)}
          >
            <span>⚡</span>
            <span>Process New Incident</span>
          </Button>

          <Link href="/health" className="w-full">
            <Button variant="secondary" size="md" className="w-full justify-start gap-2">
              <span>💚</span>
              <span>Check Service Health</span>
            </Button>
          </Link>
        </div>
      </Card>

      {/* Modal Dialog Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-panel rounded-xl max-w-lg w-full p-6 shadow-glass border border-slate-700/80 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>⚡</span>
                <span>Process New Incident Report</span>
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-200 text-lg leading-none font-bold p-1"
              >
                ✕
              </button>
            </div>
            <NewIncidentForm onClose={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </>
  )
}
