'use client'
// ============================================================
// NETRA AI — Enterprise Error Page
// Microsoft Defender–style system failure screen
// ============================================================

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertOctagon, RefreshCcw, ShieldAlert, Terminal } from 'lucide-react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('System exception captured:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4 relative overflow-hidden">
      {/* Atmospheric background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-500/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-500/5 rounded-full blur-[120px]" />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(#EF4444 1px, transparent 1px), linear-gradient(90deg, #EF4444 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card max-w-lg w-full p-8 md:p-10 text-center relative z-10 border-red-500/20"
      >
        {/* Icon */}
        <motion.div
          className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6
                     bg-red-500/10 border border-red-500/30"
          animate={{ boxShadow: ['0 0 20px rgba(239,68,68,0.15)', '0 0 40px rgba(239,68,68,0.3)', '0 0 20px rgba(239,68,68,0.15)'] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <AlertOctagon className="w-9 h-9 text-red-400" strokeWidth={1.5} />
        </motion.div>

        <h1 className="text-heading-xl text-text-primary mb-2">System Failure</h1>
        <p className="text-body-md text-text-secondary mb-6 max-w-sm mx-auto">
          A critical error occurred while processing the intelligence data. The incident has been logged and reported.
        </p>

        {/* Error details (dev only) */}
        {process.env.NODE_ENV === 'development' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="text-left mb-6 p-4 bg-black/50 rounded-lg overflow-x-auto border border-red-500/20"
          >
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="w-3.5 h-3.5 text-red-400" />
              <span className="text-body-xs font-mono text-red-400 uppercase tracking-wider">Exception Trace</span>
            </div>
            <pre className="text-body-xs font-mono text-red-300/80 whitespace-pre-wrap break-all">
              {error.message}
            </pre>
            {error.digest && (
              <p className="text-body-xs text-text-tertiary font-mono mt-2 pt-2 border-t border-red-500/10">
                Digest: {error.digest}
              </p>
            )}
          </motion.div>
        )}

        {/* Status indicator */}
        <div className="flex items-center justify-center gap-2 mb-6 text-body-xs text-text-tertiary">
          <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
          <span className="font-mono uppercase tracking-wider">INCIDENT LOGGED · CLEARANCE MAINTAINED</span>
        </div>

        <button
          onClick={() => reset()}
          className="btn-primary w-full bg-red-600 hover:bg-red-500 focus-visible:ring-red-500"
        >
          <RefreshCcw className="w-4 h-4" />
          Attempt System Recovery
        </button>
      </motion.div>
    </div>
  )
}
