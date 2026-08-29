'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Card } from './card'
import { Button } from './button'

interface Props {
  children?: ReactNode
  fallbackTitle?: string
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[React Error Boundary] Uncaught error:', error, errorInfo)
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Card className="border-red-500/30 bg-red-950/10 p-6 my-4">
          <div className="flex flex-col items-center text-center space-y-3">
            <span className="text-3xl">⚠️</span>
            <h3 className="text-sm font-bold text-red-400">
              {this.props.fallbackTitle || 'Component Rendering Error'}
            </h3>
            <p className="text-xs text-slate-400 font-mono max-w-md">
              {this.state.error?.message || 'An unexpected error occurred while rendering this section.'}
            </p>
            <Button variant="secondary" size="sm" onClick={handleResetClick(this.handleReset)}>
              Retry
            </Button>
          </div>
        </Card>
      )
    }

    return this.props.children
  }
}

function handleResetClick(resetFn: () => void) {
  return () => resetFn()
}
