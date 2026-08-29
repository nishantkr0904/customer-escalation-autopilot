'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { StatusIndicator } from '../ui/status-indicator'

export const Header: React.FC = () => {
  const pathname = usePathname()

  let pageTitle = 'Dashboard'
  const breadcrumbs = ['Home']

  if (pathname.startsWith('/incidents')) {
    pageTitle = 'Incidents'
    breadcrumbs.push('Incidents')
    if (pathname !== '/incidents') {
      const id = pathname.split('/')[2]
      breadcrumbs.push(id ? `Detail (${id.slice(0, 8)}...)` : 'Detail')
    }
  } else if (pathname.startsWith('/workflow')) {
    pageTitle = 'Workflow Pipeline'
    breadcrumbs.push('Workflow')
  } else if (pathname.startsWith('/health')) {
    pageTitle = 'Service Health'
    breadcrumbs.push('Health')
  }

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-10 px-6 flex items-center justify-between">
      {/* Breadcrumbs & Title */}
      <div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-slate-600">/</span>}
              <span>{crumb}</span>
            </React.Fragment>
          ))}
        </div>
        <h2 className="text-sm font-bold text-slate-100 tracking-tight mt-0.5">
          {pageTitle}
        </h2>
      </div>

      {/* System Health Status */}
      <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-full text-xs">
        <StatusIndicator status="healthy" showLabel={false} size="sm" />
        <span className="text-xs text-slate-300 font-medium">
          All Systems Operational
        </span>
      </div>
    </header>
  )
}
