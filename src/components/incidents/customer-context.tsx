'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Customer } from '@/lib/types'
import { formatCurrency, formatRelativeTime } from '@/lib/utils/formatters'

interface CustomerContextProps {
  customer: Customer | null
}

export const CustomerContextCard: React.FC<CustomerContextProps> = ({ customer }) => {
  if (!customer) {
    return (
      <Card title="Customer Context (HubSpot 360)" description="CRM account parameters">
        <div className="py-6 text-center text-xs text-slate-500 italic">
          No customer record found in HubSpot for this incident.
        </div>
      </Card>
    )
  }

  // Health score color
  let healthColor = 'text-emerald-400 bg-emerald-500'
  if (customer.healthScore < 50) {
    healthColor = 'text-red-400 bg-red-500'
  } else if (customer.healthScore < 75) {
    healthColor = 'text-amber-400 bg-amber-500'
  }

  // Churn risk color badge
  let churnRiskBadge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
  if (customer.churnRisk === 'high') {
    churnRiskBadge = 'bg-red-500/10 text-red-400 border-red-500/30 font-semibold'
  } else if (customer.churnRisk === 'medium') {
    churnRiskBadge = 'bg-amber-500/10 text-amber-400 border-amber-500/30'
  }

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>👤</span>
            <span className="font-bold text-slate-100">{customer.name}</span>
          </div>
          <span className="text-xs uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {customer.tier}
          </span>
        </div>
      }
      description={`HubSpot CRM ID: ${customer.id}`}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs pt-1">
        <div>
          <span className="text-slate-400 block text-[11px]">Contract Value (ACV)</span>
          <span className="font-bold text-slate-100 text-sm mt-0.5 block">
            {formatCurrency(customer.contractValue)}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block text-[11px]">Contact Person</span>
          <span className="font-semibold text-slate-200 mt-0.5 block">{customer.contactName}</span>
          <span className="text-[10px] text-slate-400">{customer.email}</span>
        </div>

        <div>
          <span className="text-slate-400 block text-[11px]">Account Manager</span>
          <span className="font-semibold text-slate-200 mt-0.5 block">{customer.accountManager}</span>
        </div>

        <div>
          <span className="text-slate-400 block text-[11px]">Health Score</span>
          <div className="flex items-center gap-2 mt-1">
            <span className={`font-bold ${healthColor.split(' ')[0]}`}>
              {customer.healthScore}/100
            </span>
            <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${healthColor.split(' ')[1]}`}
                style={{ width: `${customer.healthScore}%` }}
              />
            </div>
          </div>
        </div>

        <div>
          <span className="text-slate-400 block text-[11px]">Churn Risk</span>
          <span
            className={`inline-block mt-1 text-[11px] px-2 py-0.5 rounded border uppercase tracking-wider ${churnRiskBadge}`}
          >
            {customer.churnRisk}
          </span>
        </div>

        <div>
          <span className="text-slate-400 block text-[11px]">Industry & Region</span>
          <span className="font-medium text-slate-200 mt-0.5 block">
            {customer.industry} ({customer.region})
          </span>
        </div>

        <div>
          <span className="text-slate-400 block text-[11px]">Employees</span>
          <span className="font-medium text-slate-200 mt-0.5 block">
            {customer.employeeCount.toLocaleString()} employees
          </span>
        </div>

        <div>
          <span className="text-slate-400 block text-[11px]">Open Tickets</span>
          <span className="font-medium text-slate-200 mt-0.5 block">
            {customer.openTickets} active tickets
          </span>
        </div>

        <div>
          <span className="text-slate-400 block text-[11px]">Last Contact</span>
          <span className="font-medium text-slate-200 mt-0.5 block">
            {formatRelativeTime(customer.lastContactDate)}
          </span>
        </div>
      </div>
    </Card>
  )
}
