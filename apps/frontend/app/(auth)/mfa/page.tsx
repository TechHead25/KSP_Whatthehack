'use client'
// ============================================================
// NETRA AI — MFA Verification Page
// ============================================================

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Smartphone, AlertCircle, Loader2, ChevronLeft, Shield } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useAuthStore } from '@/lib/stores/authStore'
import Link from 'next/link'

export default function MFAPage() {
  const { verifyMFA, isLoading, error } = useAuth()
  const tempToken = useAuthStore((s) => s.tempToken)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  // Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const next = [...otp]
    next[index] = value.slice(-1)
    setOtp(next)
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
    // Auto-submit when complete
    if (value && index === 5) {
      const code = [...next].join('')
      if (code.length === 6 && tempToken) {
        verifyMFA({ otp: code, temp_token: tempToken })
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setOtp(pasted.split(''))
      if (tempToken) verifyMFA({ otp: pasted, temp_token: tempToken })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length === 6 && tempToken) {
      verifyMFA({ otp: code, temp_token: tempToken })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5
                     bg-accent-cyan/10 border border-accent-cyan/30"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
        >
          <Smartphone className="w-8 h-8 text-accent-cyan" strokeWidth={1.5} />
        </motion.div>
        <h1 className="text-heading-xl text-text-primary mb-2">Verify Identity</h1>
        <p className="text-body-md text-text-secondary">
          Enter the 6-digit code from your authenticator app
        </p>
      </div>

      {/* Card */}
      <div className="glass-card p-8">
        {error && (
          <motion.div
            className="flex items-start gap-3 p-3.5 rounded-lg mb-5
                       bg-red-500/10 border border-red-500/30 text-red-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="text-body-sm">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          {/* OTP inputs */}
          <div
            className="flex items-center justify-center gap-3 mb-8"
            onPaste={handlePaste}
          >
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el }}
                id={`otp-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="
                  w-12 h-14 text-center text-heading-md font-mono font-bold
                  bg-bg-surface border border-border-default rounded-lg
                  text-text-primary
                  focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30
                  transition-all duration-150
                  disabled:opacity-50
                "
                disabled={isLoading}
                aria-label={`OTP digit ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={otp.join('').length !== 6 || isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</>
            ) : (
              <><Shield className="w-4 h-4" strokeWidth={1.5} /> Verify & Continue</>
            )}
          </button>
        </form>


      </div>

      <div className="mt-4 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-body-sm text-text-tertiary
                     hover:text-text-secondary transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to login
        </Link>
      </div>
    </motion.div>
  )
}
