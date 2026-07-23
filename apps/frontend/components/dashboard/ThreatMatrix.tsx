'use client'
// ============================================================
// NETRA AI — Threat Matrix Widget
// Heatmap-style grid showing risk zones with pulse animations
// Inspired by: Palantir Gotham threat matrices
// ============================================================

import { motion } from 'framer-motion'
import { Crosshair } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface ThreatZone {
  zone: string
  riskScore: number
  crimeCount: number
  trend: 'UP' | 'DOWN' | 'STABLE'
}

interface ThreatMatrixProps {
  zones: ThreatZone[]
  isLoading?: boolean
}

function getRiskLevel(score: number): { label: string; color: string; glow: string } {
  if (score >= 80) return { label: 'CRITICAL', color: 'bg-red-500/25 border-red-500/50 text-red-300', glow: 'shadow-[0_0_16px_rgba(239,68,68,0.25)]' }
  if (score >= 60) return { label: 'HIGH', color: 'bg-orange-500/20 border-orange-500/40 text-orange-300', glow: 'shadow-[0_0_12px_rgba(249,115,22,0.2)]' }
  if (score >= 40) return { label: 'MEDIUM', color: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-300', glow: '' }
  return { label: 'LOW', color: 'bg-green-500/10 border-green-500/25 text-green-300', glow: '' }
}

export function ThreatMatrix({ zones, isLoading }: ThreatMatrixProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="glass-card p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center">
            <Crosshair className="w-4 h-4 text-red-400" strokeWidth={1.5} />
          </div>
          <h3 className="text-heading-sm text-text-primary">Threat Matrix</h3>
        </div>
        <span className="flex items-center gap-2 text-body-xs font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded border border-green-400/20">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          LIVE
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-2">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
             <div key={i} className="h-24 rounded-lg bg-bg-elevated/40 shimmer" />
          ))
        ) : zones.map((zone, index) => {
          const risk = getRiskLevel(zone.riskScore)
          return (
            <motion.div
              key={zone.zone}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.06 }}
              role="button"
              tabIndex={0}
              aria-label={`Threat Zone: ${zone.zone}, Risk Score: ${zone.riskScore}`}
              className={cn(
                'p-3 rounded-lg border cursor-pointer transition-all duration-300 hover:scale-[1.02]',
                risk.color,
                risk.glow
              )}
              onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                  }
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-body-xs font-semibold uppercase tracking-wider truncate">
                  {zone.zone}
                </span>
                {zone.riskScore >= 80 && (
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse-ring" />
                )}
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-heading-lg font-mono font-light">
                  {zone.riskScore}
                </span>
                <span className="text-body-xs text-current opacity-60 font-mono">
                  risk
                </span>
              </div>
              <p className="text-body-xs mt-1 opacity-70">
                {zone.crimeCount} incidents
              </p>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
