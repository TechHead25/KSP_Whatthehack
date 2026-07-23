'use client'
// ============================================================
// NETRA AI — Alerts Feed Widget
// Live-scrolling alert timeline with severity-coded badges
// Inspired by: Microsoft Defender incident feed
// ============================================================

import { motion } from 'framer-motion'
import { AlertTriangle, Shield, Radio, Siren } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface AlertItem {
  id: string
  message: string
  severity: string
  type: string
  time: string
}

interface AlertsFeedProps {
  alerts: AlertItem[]
  unreadCount: number
  isLoading?: boolean
}

const SEVERITY_CONFIG: Record<string, { color: string; icon: React.ElementType; badge: string }> = {
  CRITICAL: { color: 'red', icon: Siren, badge: 'risk-badge-critical' },
  HIGH: { color: 'orange', icon: AlertTriangle, badge: 'risk-badge-high' },
  MEDIUM: { color: 'yellow', icon: Shield, badge: 'risk-badge-medium' },
  LOW: { color: 'green', icon: Radio, badge: 'risk-badge-low' },
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0 },
}

export function AlertsFeed({ alerts, unreadCount, isLoading }: AlertsFeedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-5 flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center">
            <Siren className="w-4 h-4 text-red-400" strokeWidth={1.5} />
          </div>
          <h3 className="text-heading-sm text-text-primary">Active Alerts</h3>
        </div>
        {unreadCount > 0 && (
          <span className="px-2.5 py-1 rounded-full text-body-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse-ring">
            {unreadCount} unread
          </span>
        )}
      </div>

      {/* Feed */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-2 overflow-y-auto flex-1 pr-1"
      >
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-bg-elevated/40">
              <div className="w-7 h-7 rounded-md bg-bg-surface shimmer flex-shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-bg-surface shimmer rounded w-5/6" />
                <div className="h-3 bg-bg-surface shimmer rounded w-1/3" />
              </div>
            </div>
          ))
        ) : alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-text-tertiary">
            <Shield className="w-8 h-8 mb-3 opacity-50" />
            <p className="text-body-sm">No active alerts</p>
            <p className="text-body-xs mt-1">Your jurisdiction is clear</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const config = SEVERITY_CONFIG[alert.severity] ?? SEVERITY_CONFIG.LOW
            const AlertIcon = config.icon
            return (
              <motion.div
                key={alert.id}
                variants={item}
                role="button"
                tabIndex={0}
                aria-label={`Alert: ${alert.message}, Severity: ${alert.severity}`}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer',
                  'bg-bg-surface/60 border-border-subtle hover:border-border-default hover:bg-bg-elevated/40'
                )}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    // handler logic
                  }
                }}
              >
                <div
                  className={cn(
                    'w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5',
                    alert.severity === 'CRITICAL'
                      ? 'bg-red-500/15 text-red-400'
                      : alert.severity === 'HIGH'
                        ? 'bg-orange-500/15 text-orange-400'
                        : 'bg-yellow-500/15 text-yellow-400'
                  )}
                >
                  <AlertIcon className="w-3.5 h-3.5" strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-body-sm text-text-primary font-medium truncate">
                    {alert.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={config.badge}>{alert.severity}</span>
                    <span className="text-body-xs text-text-tertiary font-mono">{alert.time}</span>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </motion.div>
    </motion.div>
  )
}
