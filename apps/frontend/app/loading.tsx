'use client'
// ============================================================
// NETRA AI — Enterprise Loading State
// Palantir-class boot sequence animation
// ============================================================

import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

export default function Loading() {
  return (
    <div className="h-[70vh] w-full flex items-center justify-center relative overflow-hidden">
      {/* Background grid pulse */}
      <div
        className="absolute inset-0 animate-grid-pulse"
        style={{
          backgroundImage:
            'linear-gradient(rgba(59,130,246,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.6) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Scan line effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-full h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent animate-scan-line"
        />
      </div>

      {/* Core loader */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6 relative z-10"
      >
        {/* Logo pulse */}
        <div className="relative">
          <motion.div
            className="w-16 h-16 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center"
            animate={{ boxShadow: ['0 0 20px rgba(59,130,246,0.2)', '0 0 40px rgba(59,130,246,0.5)', '0 0 20px rgba(59,130,246,0.2)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Zap className="w-7 h-7 text-brand-400" strokeWidth={2} />
          </motion.div>
          {/* Orbital ring */}
          <motion.div
            className="absolute -inset-3 rounded-3xl border border-brand-500/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute -inset-6 rounded-3xl border border-brand-500/10"
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        {/* Boot text */}
        <div className="text-center space-y-2">
          <motion.p
            className="text-body-sm font-semibold text-text-primary tracking-wide"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            INITIALIZING SECURE TERMINAL
          </motion.p>
          <div className="flex items-center gap-1.5 justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-brand-400"
                animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
          <p className="text-body-xs text-text-tertiary font-mono">
            NETRA AI v1.0.0 · Encrypted Channel
          </p>
        </div>
      </motion.div>
    </div>
  )
}
