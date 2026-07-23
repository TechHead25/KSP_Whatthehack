'use client'
// ============================================================
// NETRA AI — Crime Analytics Chart Widget
// CSS-only animated bar chart for crime type distribution
// Inspired by: Databricks visualizations / Snowflake charts
// ============================================================

import { motion } from 'framer-motion'
import { BarChart3 } from 'lucide-react'

interface CrimeTypeData {
  type: string
  count: number
  percentage: number
}

interface CrimeAnalyticsChartProps {
  data: CrimeTypeData[]
  isLoading?: boolean
}

const BAR_COLORS = [
  'from-brand-500 to-brand-600',
  'from-cyan-500 to-cyan-600',
  'from-purple-500 to-purple-600',
  'from-amber-500 to-amber-600',
  'from-red-500 to-red-600',
  'from-emerald-500 to-emerald-600',
  'from-orange-500 to-orange-600',
  'from-pink-500 to-pink-600',
]

const GLOW_COLORS = [
  'shadow-[0_0_12px_rgba(59,130,246,0.3)]',
  'shadow-[0_0_12px_rgba(6,182,212,0.3)]',
  'shadow-[0_0_12px_rgba(139,92,246,0.3)]',
  'shadow-[0_0_12px_rgba(245,158,11,0.3)]',
  'shadow-[0_0_12px_rgba(239,68,68,0.3)]',
  'shadow-[0_0_12px_rgba(16,185,129,0.3)]',
  'shadow-[0_0_12px_rgba(249,115,22,0.3)]',
  'shadow-[0_0_12px_rgba(236,72,153,0.3)]',
]

export function CrimeAnalyticsChart({ data, isLoading }: CrimeAnalyticsChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-purple-400" strokeWidth={1.5} />
          </div>
          <h3 className="text-heading-sm text-text-primary">Crime Distribution</h3>
        </div>
        <span className="text-body-xs text-text-tertiary font-mono">This month</span>
      </div>

      {/* Bars */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
             <div key={i} className="space-y-1.5">
                <div className="flex justify-between">
                   <div className="h-4 w-1/4 bg-bg-elevated/40 shimmer rounded" />
                   <div className="h-4 w-1/6 bg-bg-elevated/40 shimmer rounded" />
                </div>
                <div className="h-2 w-full bg-bg-surface rounded-full overflow-hidden">
                   <div className="h-full bg-bg-elevated/40 shimmer w-3/4" />
                </div>
             </div>
          ))
        ) : data.map((crime, index) => (
          <div key={crime.type} className="group">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-body-sm text-text-secondary font-medium group-hover:text-text-primary transition-colors">
                {crime.type}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-body-sm font-mono text-text-primary font-medium">
                  {crime.count}
                </span>
                <span className="text-body-xs font-mono text-text-tertiary w-10 text-right">
                  {crime.percentage}%
                </span>
              </div>
            </div>
            <div className="h-2 bg-bg-surface rounded-full overflow-hidden border border-border-subtle">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(crime.count / maxCount) * 100}%` }}
                transition={{ delay: 0.5 + index * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`h-full rounded-full bg-gradient-to-r ${BAR_COLORS[index % BAR_COLORS.length]} ${GLOW_COLORS[index % GLOW_COLORS.length]}`}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
