import React from 'react'
import { Sidebar } from './sidebar'
import { Header } from './header'

export interface AppShellProps {
  children: React.ReactNode
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-background-primary text-slate-100 antialiased">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}
