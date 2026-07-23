'use client'
// ============================================================
// NETRA AI — KPI Card Widget
// Animated counter, trend indicator, glassmorphic surface
// Inspired by: Palantir Gotham KPI tiles
// ============================================================

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface KPICardProps {
  label: string
  value: number
  trend?: number
  trendDirection?: 'UP' | 'DOWN' | 'STABLE'
  icon: React.ElementType
  accentColor?: string
  suffix?: string
  delay?: number
}

function useAnimatedCounter(target: number, duration = 1200) {
  const [count, setCount] = useState(0)
  const ref = useRef<number>(0)

  useEffect(() => {
    const startTime = performance.now()
    const startValue = ref.current

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(startValue + (target - startValue) * eased)
      setCount(current)

      if (progress < 1) {
        requestAnimationFrame(tick)
      } else {
        ref.current = target
      }
    }

    requestAnimationFrame(tick)
  }, [target, duration])

  return count
}

export function KPICard({
  label,
  value,
  trend,
  trendDirection = 'STABLE',
  icon: Icon,
  accentColor = 'brand',
  suffix = '',
  delay = 0,
}: KPICardProps) {
  const animatedValue = useAnimatedCounter(value)

  const trendColor =
    trendDirection === 'UP'
      ? 'text-red-400'
      : trendDirection === 'DOWN'
        ? 'text-green-400'
        : 'text-text-tertiary'

  const TrendIcon =
    trendDirection === 'UP'
      ? TrendingUp
      : trendDirection === 'DOWN'
        ? TrendingDown
        : Minus

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card p-5 relative overflow-hidden group cursor-default"
    >
      {/* Background glow */}
      <div
        className={cn(
          'absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-20 transition-opacity duration-500 group-hover:opacity-40',
          accentColor === 'cyan' ? 'bg-accent-cyan' : accentColor === 'red' ? 'bg-risk-critical' : accentColor === 'orange' ? 'bg-risk-high' : 'bg-brand-500'
        )}
      />

      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-3">
          <p className="text-body-xs font-semibold uppercase tracking-widest text-text-tertiary">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-display-lg font-mono font-light tracking-tight text-text-primary leading-none">
              {animatedValue.toLocaleString()}
            </span>
            {suffix && (
              <span className="text-body-md text-text-tertiary font-mono">
                {suffix}
              </span>
            )}
          </div>
          {trend !== undefined && (
            <div className={cn('flex items-center gap-1.5 text-body-sm font-medium', trendColor)}>
              <TrendIcon className="w-3.5 h-3.5" />
              <span>{Math.abs(trend)}%</span>
              <span className="text-text-tertiary font-normal">vs last week</span>
            </div>
          )}
        </div>

        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all duration-300 group-hover:scale-110',
            accentColor === 'cyan'
              ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
              : accentColor === 'red'
                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                : accentColor === 'orange'
                  ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                  : 'bg-brand-500/10 border-brand-500/30 text-brand-400'
          )}
        >
          <Icon className="w-5 h-5" strokeWidth={1.5} />
        </div>
      </div>
    </motion.div>
  )
}
