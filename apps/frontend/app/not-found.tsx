'use client'
// ============================================================
// NETRA AI — Enterprise 404 Page
// Palantir Gotham–style "Target Not Found"
// ============================================================

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Crosshair, Home, Search, Radio } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4 relative overflow-hidden">
      {/* Atmospheric background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-500/6 rounded-full blur-[180px]" />
        {/* Radar rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="w-64 h-64 rounded-full border border-brand-500/10"
            animate={{ scale: [1, 3], opacity: [0.3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-0 w-64 h-64 rounded-full border border-brand-500/10"
            animate={{ scale: [1, 3], opacity: [0.3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear', delay: 2 }}
          />
        </div>
        {/* Grid */}
        <div
          className="absolute inset-0 animate-grid-pulse"
          style={{
            backgroundImage: 'linear-gradient(rgba(59,130,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,1) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card max-w-lg w-full p-8 md:p-10 text-center relative z-10"
      >
        {/* Icon */}
        <motion.div
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6
                     bg-brand-500/10 border border-brand-500/30 relative"
          animate={{ boxShadow: ['0 0 20px rgba(59,130,246,0.1)', '0 0 40px rgba(59,130,246,0.3)', '0 0 20px rgba(59,130,246,0.1)'] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Crosshair className="w-9 h-9 text-brand-400" strokeWidth={1.5} />
          <motion.div
            className="absolute -inset-2 rounded-2xl border border-brand-500/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>

        {/* Code */}
        <motion.h1
          className="text-[80px] font-mono font-light text-text-primary mb-1 leading-none tracking-tighter"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="text-gradient-brand">404</span>
        </motion.h1>

        <motion.h2
          className="text-heading-lg text-text-primary mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Target Not Found
        </motion.h2>

        <motion.p
          className="text-body-md text-text-secondary mb-8 max-w-sm mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          The requested intelligence record or module does not exist in the active database, or you do not have clearance to view it.
        </motion.p>

        {/* Status bar */}
        <div className="flex items-center justify-center gap-2 mb-6 text-body-xs text-text-tertiary">
          <Radio className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
          <span className="font-mono uppercase tracking-wider">SCANNING NETWORK · NO MATCH</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/" className="btn-primary flex-1 inline-flex">
            <Home className="w-4 h-4" />
            Command Center
          </Link>
          <Link href="/" className="btn-ghost flex-1 inline-flex border border-border-subtle">
            <Search className="w-4 h-4" />
            Search Intel
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
