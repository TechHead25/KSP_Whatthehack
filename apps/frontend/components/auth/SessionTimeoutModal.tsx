'use client'

import { useSessionTimeout } from '@/lib/hooks/useSessionTimeout'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock } from 'lucide-react'

export function SessionTimeoutModal() {
  const { showWarning, extendSession } = useSessionTimeout()

  return (
    <AnimatePresence>
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-bg-surface border border-border-default rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Session Expiring Soon</h3>
                  <p className="text-text-secondary text-sm">
                    You have been inactive for a while. Your session will expire in 1 minute to protect your account.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={extendSession}
                  className="flex-1 bg-brand-600 hover:bg-brand-500 text-white font-bold py-2.5 rounded-xl transition-colors"
                >
                  Continue Session
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
