'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function ResetPasswordPage() {
  const [mounted, setMounted] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setSubmitted(true)
  }

  return (
    <div className="flex min-h-screen bg-bg-base overflow-hidden items-center justify-center p-4">
      <div className="w-full max-w-md bg-bg-surface border border-border-strong rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Set New Password</h1>
            <p className="text-xs text-text-tertiary">NETRA Account Security</p>
          </div>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-white mb-2">Password Updated</h2>
            <p className="text-xs text-text-secondary mb-6 leading-relaxed">
              Your password has been successfully updated. You may now sign in with your new credentials.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-lg text-xs font-semibold transition-colors"
            >
              Sign In <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400 font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-bg-base border border-border-default rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-text-tertiary focus:outline-none focus:border-brand-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1.5">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-bg-base border border-border-default rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-text-tertiary focus:outline-none focus:border-brand-500/50 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brand-600 hover:bg-brand-500 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-glow-sm"
            >
              Update Password <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
