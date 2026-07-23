'use client'
// ============================================================
// NETRA AI — Enterprise Loading Spinner
// Palantir-class orbital loading indicator
// ============================================================

import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  text?: string
  variant?: 'default' | 'inline'
}

const sizeConfig = {
  sm: { ring: 'w-8 h-8', icon: 'w-3 h-3', text: 'text-body-xs' },
  md: { ring: 'w-12 h-12', icon: 'w-4 h-4', text: 'text-body-sm' },
  lg: { ring: 'w-16 h-16', icon: 'w-5 h-5', text: 'text-body-sm' },
  xl: { ring: 'w-20 h-20', icon: 'w-6 h-6', text: 'text-body-md' },
}

export function LoadingSpinner({ size = 'md', className, text, variant = 'default' }: LoadingSpinnerProps) {
  const config = sizeConfig[size]

  if (variant === 'inline') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <motion.div
          className="w-4 h-4 rounded-full border-2 border-brand-500/30 border-t-brand-400"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
        {text && <span className="text-body-sm text-text-secondary">{text}</span>}
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      {/* Orbital spinner */}
      <div className="relative">
        {/* Outer ring */}
        <motion.div
          className={cn(config.ring, 'rounded-full border border-brand-500/20')}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        {/* Inner ring */}
        <motion.div
          className={cn(
            'absolute inset-1 rounded-full border border-dashed border-accent-cyan/30'
          )}
          animate={{ rotate: -360 }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        />
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.05, 0.9] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Zap className={cn(config.icon, 'text-brand-400')} strokeWidth={2} />
          </motion.div>
        </div>
      </div>

      {text && (
        <div className="text-center space-y-1">
          <motion.p
            className={cn(config.text, 'font-medium text-text-secondary tracking-wide')}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {text}
          </motion.p>
          <div className="flex items-center gap-1 justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1 h-1 rounded-full bg-brand-400"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
