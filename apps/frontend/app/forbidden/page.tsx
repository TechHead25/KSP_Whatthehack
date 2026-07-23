'use client'
// ============================================================
// NETRA AI — Enterprise 403 Forbidden Page
// Red alert security lockout screen
// ============================================================

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShieldX, Home, Lock, AlertTriangle } from 'lucide-react'

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4 relative overflow-hidden">
      {/* Atmospheric background — red alert */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-500/6 rounded-full blur-[180px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-red-900/5 rounded-full blur-[120px]" />
        {/* Warning stripes */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(239,68,68,1) 40px, rgba(239,68,68,1) 42px)',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card max-w-lg w-full p-8 md:p-10 text-center relative z-10 border-red-500/20"
      >
        {/* Top security bar */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-gradient-to-r from-red-500/60 via-red-400/80 to-red-500/60"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Icon */}
        <motion.div
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6
                     bg-red-500/10 border border-red-500/30"
          animate={{ boxShadow: ['0 0 20px rgba(239,68,68,0.1)', '0 0 40px rgba(239,68,68,0.25)', '0 0 20px rgba(239,68,68,0.1)'] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ShieldX className="w-9 h-9 text-red-400" strokeWidth={1.5} />
        </motion.div>

        {/* Code */}
        <motion.h1
          className="text-[80px] font-mono font-light text-red-400 mb-1 leading-none tracking-tighter"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          403
        </motion.h1>

        <motion.h2
          className="text-heading-lg text-text-primary mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Access Denied
        </motion.h2>

        <motion.p
          className="text-body-md text-text-secondary mb-6 max-w-sm mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Your current security clearance does not permit access to this module. All unauthorized access attempts are logged.
        </motion.p>

        {/* Security warning panel */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20 mb-6">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-body-xs text-red-300/80 text-left font-mono">
            CLEARANCE INSUFFICIENT · ACCESS LOGGED · INCIDENT ID: #{Math.random().toString(36).slice(2, 10).toUpperCase()}
          </p>
        </div>

        {/* Action */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/" className="btn-primary flex-1 inline-flex">
            <Home className="w-4 h-4" />
            Return to Command Center
          </Link>
          <Link href="/login" className="btn-ghost flex-1 inline-flex border border-border-subtle">
            <Lock className="w-4 h-4" />
            Re-Authenticate
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
