'use client'
// ============================================================
// NETRA AI — Widget Error Boundary
// Graceful per-widget failure isolation
// ============================================================

import React from 'react'
import { AlertTriangle, RefreshCcw } from 'lucide-react'

interface Props {
  children: React.ReactNode
  fallbackTitle?: string
}

interface State {
  hasError: boolean
  error?: Error
}

export class WidgetErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[WidgetError]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="glass-card p-5 flex flex-col items-center justify-center min-h-[200px] text-center">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-3">
            <AlertTriangle className="w-5 h-5 text-red-400" strokeWidth={1.5} />
          </div>
          <p className="text-body-sm text-text-primary font-medium mb-1">
            {this.props.fallbackTitle ?? 'Widget Error'}
          </p>
          <p className="text-body-xs text-text-tertiary mb-3 max-w-[240px]">
            This module encountered an error and has been safely isolated.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            className="btn-ghost text-body-xs px-3 py-1.5 border border-border-subtle"
          >
            <RefreshCcw className="w-3 h-3 mr-1.5" />
            Retry
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
