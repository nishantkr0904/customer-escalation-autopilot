import type { Metadata } from 'next'
import './globals.css'
import { AppShell } from '@/components/layout/app-shell'

export const metadata: Metadata = {
  title: {
    default: 'Customer Escalation Autopilot | AI-Powered Incident Triage',
    template: '%s | Customer Escalation Autopilot',
  },
  description:
    'Enterprise AI-powered incident triage, 360-degree context enrichment from HubSpot, Stripe & GitHub, and automated multi-channel escalation workflows.',
  keywords: [
    'Incident Triage',
    'AI Escalation',
    'Customer Support Automation',
    'Gemini AI',
    'Linear Ticket Automation',
    'HubSpot Context',
    'SLA Monitoring',
  ],
  authors: [{ name: 'Engineering Team' }],
  openGraph: {
    title: 'Customer Escalation Autopilot | AI Incident Triage Engine',
    description:
      'Automate 30-minute customer incident triage into seconds with AI severity analysis and multi-channel escalation.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Customer Escalation Autopilot',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Customer Escalation Autopilot',
    description: 'AI-powered incident triage and automated escalation workflows.',
  },
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
