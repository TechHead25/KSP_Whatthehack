'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { KeyRound, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [mounted, setMounted] = useState(false)
  const [badgeNumber, setBadgeNumber] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="flex min-h-screen bg-bg-base overflow-hidden items-center justify-center p-4">
      <div className="w-full max-w-md bg-bg-surface border border-border-strong rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Password Reset</h1>
            <p className="text-xs text-text-tertiary">NETRA Security Verification</p>
          </div>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-white mb-2">Reset Link Dispatched</h2>
            <p className="text-xs text-text-secondary mb-6 leading-relaxed">
              If badge <span className="font-mono text-brand-400 font-bold">{badgeNumber}</span> is registered in the system, a secure reset link has been dispatched to your official department email.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-lg text-xs font-semibold transition-colors"
            >
              Return to Login <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Official Badge Number</label>
              <input
                type="text"
                required
                value={badgeNumber}
                onChange={(e) => setBadgeNumber(e.target.value)}
                placeholder="e.g. KSP-8821"
                className="w-full bg-bg-base border border-border-default rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-text-tertiary focus:outline-none focus:border-brand-500/50 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-500 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-glow-sm"
            >
              Send Reset Instructions <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-4 text-center border-t border-border-subtle">
              <Link href="/login" className="text-xs text-brand-400 hover:underline">
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
