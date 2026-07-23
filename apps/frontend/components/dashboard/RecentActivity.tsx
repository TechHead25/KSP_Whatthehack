'use client'
// ============================================================
// NETRA AI — Recent Activity Widget
// Timeline-style feed of recent investigations/actions
// Inspired by: Linear activity feed / GitHub timeline
// ============================================================

import { motion } from 'framer-motion'
import { FileText, Camera, Users, MapPin, MessageSquare, Clock } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { ActivityItem } from '@/lib/api/dashboardApi'

interface RecentActivityProps {
  activities: ActivityItem[]
  isLoading?: boolean
}

const ENTITY_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
  FIR: { icon: FileText, color: 'text-brand-400 bg-brand-500/10 border-brand-500/30' },
  EVIDENCE: { icon: Camera, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
  SUSPECT: { icon: Users, color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' },
  LOCATION: { icon: MapPin, color: 'text-green-400 bg-green-500/10 border-green-500/30' },
  AI: { icon: MessageSquare, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
}

export function RecentActivity({ activities, isLoading }: RecentActivityProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="glass-card p-5 flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/30 flex items-center justify-center">
            <Clock className="w-4 h-4 text-brand-400" strokeWidth={1.5} />
          </div>
          <h3 className="text-heading-sm text-text-primary">Recent Activity</h3>
        </div>
        <span className="text-body-xs text-text-tertiary font-mono">
          Last 24h
        </span>
      </div>

      {/* Timeline */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-1 overflow-y-auto flex-1 pr-1"
      >
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 p-2.5">
              <div className="w-7 h-7 rounded-md bg-bg-elevated shimmer flex-shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-bg-elevated shimmer rounded w-3/4" />
                <div className="h-3 bg-bg-elevated shimmer rounded w-1/4" />
              </div>
            </div>
          ))
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-text-tertiary">
            <Clock className="w-8 h-8 mb-3 opacity-50" />
            <p className="text-body-sm">No recent activity</p>
          </div>
        ) : (
          activities.map((activity, index) => {
            const entityConfig = ENTITY_ICONS[activity.entity_type] ?? ENTITY_ICONS.FIR
            const EntityIcon = entityConfig.icon

            return (
              <motion.div
                key={`${activity.entity_id}-${index}`}
                variants={item}
                role="button"
                tabIndex={0}
                aria-label={`Activity: ${activity.action} on ${activity.entity_id}`}
                className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-bg-elevated/30 transition-colors cursor-pointer group"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                  }
                }}
              >
                {/* Timeline dot + line */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className={cn(
                      'w-7 h-7 rounded-md flex items-center justify-center border',
                      entityConfig.color
                    )}
                  >
                    <EntityIcon className="w-3.5 h-3.5" strokeWidth={1.75} />
                  </div>
                  {index < activities.length - 1 && (
                    <div className="w-px h-6 bg-border-subtle mt-1" />
                  )}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1 pt-0.5">
                  <p className="text-body-sm text-text-primary group-hover:text-brand-300 transition-colors">
                    <span className="font-medium">{activity.action}</span>
                    {' '}
                    <span className="text-text-secondary">{activity.description}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-body-xs text-text-tertiary font-mono">
                      {activity.timestamp}
                    </span>
                    <span className="text-body-xs text-text-tertiary">·</span>
                    <span className="text-body-xs text-text-tertiary font-mono">
                      {activity.entity_id}
                    </span>
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
