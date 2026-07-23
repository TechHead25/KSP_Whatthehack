'use client'
// ============================================================
// NETRA AI — Enterprise Empty State
// Beautiful, contextual empty state for all modules
// ============================================================

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

interface EmptyStateProps {
  icon: React.ElementType
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}
    >
      {/* Atmospheric background */}
      <div className="relative mb-5">
        <div className="absolute -inset-4 bg-brand-500/5 rounded-full blur-2xl" />
        <motion.div
          className="relative w-14 h-14 rounded-2xl bg-bg-elevated border border-border-default flex items-center justify-center"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Icon className="w-6 h-6 text-text-tertiary" strokeWidth={1.5} />
        </motion.div>
      </div>

      <h3 className="text-heading-sm text-text-primary mb-1.5">{title}</h3>
      <p className="text-body-sm text-text-tertiary max-w-[280px] mb-5">{description}</p>

      {action && (
        <button
          onClick={action.onClick}
          className="btn-primary text-body-sm px-4 py-2"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  )
}
