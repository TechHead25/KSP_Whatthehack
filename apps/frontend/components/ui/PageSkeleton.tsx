'use client'
// ============================================================
// NETRA AI — Enterprise Page Skeleton
// Shimmer-effect placeholders mimicking actual dashboard layout
// ============================================================

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'

const shimmerDelay = (i: number) => ({ animationDelay: `${i * 150}ms` })

export function PageSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full space-y-6"
    >
      {/* Header skeleton */}
      <div className="flex justify-between items-start">
        <div className="space-y-3">
          <div className="h-9 w-72 rounded-lg shimmer" style={shimmerDelay(0)} />
          <div className="h-4 w-96 rounded-md shimmer" style={shimmerDelay(1)} />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg shimmer" style={shimmerDelay(2)} />
          <div className="h-10 w-32 rounded-lg shimmer" style={shimmerDelay(3)} />
        </div>
      </div>

      {/* KPI row skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="glass-card p-5 space-y-4"
            style={shimmerDelay(i)}
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-3 w-20 rounded shimmer" />
                <div className="h-8 w-14 rounded shimmer" />
              </div>
              <div className="w-10 h-10 rounded-xl shimmer" />
            </div>
            <div className="h-3 w-28 rounded shimmer" />
          </div>
        ))}
      </div>

      {/* Main content grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card p-5 space-y-3 min-h-[300px]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg shimmer" />
              <div className="h-5 w-28 rounded shimmer" />
            </div>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-bg-surface/30" style={shimmerDelay(i)}>
                <div className="w-7 h-7 rounded-md shimmer flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-full rounded shimmer" />
                  <div className="h-2.5 w-24 rounded shimmer" />
                </div>
              </div>
            ))}
          </div>
          <div className="glass-card p-5 min-h-[300px]">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg shimmer" />
              <div className="h-5 w-32 rounded shimmer" />
            </div>
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-start gap-3 py-2.5" style={shimmerDelay(i)}>
                <div className="w-7 h-7 rounded-md shimmer flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-3/4 rounded shimmer" />
                  <div className="h-2.5 w-32 rounded shimmer" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-card p-5">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg shimmer" />
              <div className="h-5 w-36 rounded shimmer" />
            </div>
            <div className="space-y-3">
              {[100, 80, 60, 45, 30, 20].map((w, i) => (
                <div key={i} className="space-y-1.5" style={shimmerDelay(i)}>
                  <div className="flex justify-between">
                    <div className="h-3 w-20 rounded shimmer" />
                    <div className="h-3 w-12 rounded shimmer" />
                  </div>
                  <div className="h-2 w-full bg-bg-surface rounded-full overflow-hidden">
                    <div className={`h-full rounded-full shimmer`} style={{ width: `${w}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card p-5">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg shimmer" />
              <div className="h-5 w-28 rounded shimmer" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-3 rounded-lg bg-bg-surface/30 space-y-2" style={shimmerDelay(i)}>
                  <div className="h-3 w-16 rounded shimmer" />
                  <div className="h-7 w-10 rounded shimmer" />
                  <div className="h-2.5 w-20 rounded shimmer" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function SkeletonBox({ className }: { className?: string }) {
  return <div className={cn('rounded-md shimmer', className)} />
}
