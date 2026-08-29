import type { Metadata } from 'next'
import './globals.css'
import { AppShell } from '@/components/layout/app-shell'

export const metadata: Metadata = {
  title: 'Customer Escalation Autopilot',
  description: 'AI-powered incident triage and escalation workflow for enterprise support teams',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-background-primary text-slate-100 min-h-screen">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
