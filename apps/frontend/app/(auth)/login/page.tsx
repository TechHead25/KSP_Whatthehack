'use client'
// ============================================================
// NETRA AI — Login Page
// Enterprise-grade dark theme authentication (Split Layout)
// ============================================================

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Shield, AlertCircle, Loader2, Lock, BadgeCheck, Network, Activity, Zap, ArrowRight } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'

// ── Validation schema ─────────────────────────────────────────

const loginSchema = z.object({
  badge_number: z
    .string()
    .min(5, 'Badge number is required')
    .max(30, 'Badge number too long')
    .regex(/^[A-Z0-9-]+$/, 'Badge number must be uppercase letters, numbers and hyphens'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormValues = z.infer<typeof loginSchema>


// ── Component ────────────────────────────────────────────────

export default function LoginPage() {
  const { login, isLoading, error } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)

  // CAPTCHA Simulation State
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [captchaVerified, setCaptchaVerified] = useState(false)

  useEffect(() => setMounted(true), [])

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (values: LoginFormValues) => {
    if (showCaptcha && !captchaVerified) {
      alert("Please complete the CAPTCHA")
      return
    }

    try {
      await login({ badge_number: values.badge_number, password: values.password })
      // On success, reset attempts
      setFailedAttempts(0)
      setShowCaptcha(false)
    } catch (error: unknown) {
      const newAttempts = failedAttempts + 1
      setFailedAttempts(newAttempts)
      if (newAttempts >= 3) {
        setShowCaptcha(true)
        setCaptchaVerified(false)
      }

      if (error instanceof Error) {
        console.error(error.message)
      }
    }
  }

  if (!mounted) return null

  return (
    <div className="flex min-h-screen bg-bg-base overflow-hidden selection:bg-brand-500/30">
      {/* ── Left Pane: Animated Intelligence Graphics ── */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-16 border-r border-border-strong bg-bg-surface overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-brand-900/40 via-bg-surface to-bg-base" />
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-brand-600/20 blur-[120px]"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-600/20 blur-[120px]"
          />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
            }}
          />
        </div>

        {/* Content Top */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600/30 to-bg-base border border-brand-500/30 flex items-center justify-center shadow-glow-sm">
              <Zap className="w-5 h-5 text-brand-400" />
            </div>
            <span className="font-black text-2xl tracking-tight text-white">NETRA <span className="text-brand-400">AI</span></span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6 tracking-tight"
          >
            Predictive Intelligence <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-cyan-300">for Law Enforcement</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-text-secondary max-w-lg font-medium leading-relaxed"
          >
            The enterprise command center. Analyze billions of data points in real-time to identify threats, map criminal networks, and secure your jurisdiction.
          </motion.p>
        </div>

        {/* Abstract Graphic */}
        <div className="relative z-10 flex-1 flex items-center justify-center mt-12">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative w-full max-w-lg aspect-square"
          >
            {/* Concentric rotating rings */}
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 120, repeat: Infinity, ease: "linear" }} className="absolute inset-4 rounded-full border-[0.5px] border-brand-500/20 border-dashed" />
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 160, repeat: Infinity, ease: "linear" }} className="absolute inset-12 rounded-full border border-cyan-500/10" />
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 200, repeat: Infinity, ease: "linear" }} className="absolute inset-24 rounded-full border border-brand-400/5 bg-brand-900/5 backdrop-blur-[2px]" />

            <div className="absolute inset-0 flex items-center justify-center">
              <Network className="w-24 h-24 text-brand-500/20" strokeWidth={1} />
            </div>

            {/* Floating indicator */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 left-1/4 bg-bg-surface/60 backdrop-blur-md border border-brand-500/30 px-4 py-2 flex items-center gap-2 rounded-full shadow-glow-sm"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
              <span className="text-xs font-bold tracking-wider text-white uppercase">System Live</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-1/3 right-1/4 bg-bg-surface/60 backdrop-blur-md border border-cyan-500/30 px-4 py-2 flex items-center gap-2 rounded-full shadow-glow-sm"
            >
              <Activity className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold tracking-wider text-white uppercase">99.9% Accuracy</span>
            </motion.div>
          </motion.div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-xs font-bold text-text-tertiary tracking-widest uppercase">
          <Shield className="w-4 h-4" /> Karnataka State Police
        </div>
      </div>

      {/* ── Right Pane: Login Form ── */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-12 relative bg-[url('/grid.svg')] bg-center bg-no-repeat bg-cover">
        <div className="absolute inset-0 bg-bg-base/90 backdrop-blur-[2px]" />

        <motion.div
          className="w-full max-w-[440px] relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          {/* Mobile Logo (hidden on desktop) */}
          <div className="lg:hidden text-center mb-10">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-gradient-to-br from-brand-600/30 to-bg-base border border-brand-500/30 shadow-glow-sm"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <Zap className="w-8 h-8 text-brand-400" strokeWidth={2} />
            </motion.div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-1">NETRA <span className="text-brand-400">AI</span></h1>
            <p className="text-xs text-text-secondary tracking-[0.2em] uppercase font-bold">
              Karnataka State Police
            </p>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Welcome Back</h2>
            <p className="text-body-md text-text-secondary font-medium">
              Sign in to the Enterprise Command Center
            </p>
          </div>

          {/* Form */}
          <div className="bg-bg-surface/50 backdrop-blur-xl p-8 rounded-2xl border border-border-default shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
              {/* Error banner */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    className="flex items-start gap-3 p-4 rounded-xl mb-6 bg-red-500/10 border border-red-500/30 text-red-300"
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                {/* Badge Number */}
                <div>
                  <label htmlFor="badge_number" className="block text-xs font-bold tracking-wide uppercase text-text-secondary mb-2">
                    Badge Number
                  </label>
                  <div className="relative group">
                    <BadgeCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary group-focus-within:text-brand-400 transition-colors" strokeWidth={1.5} />
                    <input
                      id="badge_number"
                      type="text"
                      autoComplete="username"
                      autoCapitalize="characters"
                      placeholder="e.g. INSP-BLR-0001"
                      className="w-full h-12 bg-bg-base/50 border border-border-strong rounded-xl pl-12 pr-4 text-white font-mono uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all placeholder:text-text-tertiary"
                      {...register('badge_number')}
                      onChange={(e) => {
                        e.target.value = e.target.value.toUpperCase()
                        register('badge_number').onChange(e)
                      }}
                    />
                  </div>
                  {errors.badge_number && (
                    <p className="text-xs font-medium text-red-400 mt-2 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.badge_number.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-xs font-bold tracking-wide uppercase text-text-secondary">
                      Password
                    </label>
                    <a href="#" className="text-xs font-bold text-brand-400 hover:text-brand-300 transition-colors">
                      Forgot Password?
                    </a>
                  </div>

                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary group-focus-within:text-brand-400 transition-colors" strokeWidth={1.5} />
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      className="w-full h-12 bg-bg-base/50 border border-border-strong rounded-xl pl-12 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all placeholder:text-text-tertiary"
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-white transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" strokeWidth={1.5} /> : <Eye className="w-5 h-5" strokeWidth={1.5} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs font-medium text-red-400 mt-2 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center gap-3 mt-4">
                  <input type="checkbox" id="remember" className="w-4 h-4 rounded bg-bg-base border-border-strong text-brand-500 focus:ring-brand-500/50 focus:ring-offset-0 transition-colors" />
                  <label htmlFor="remember" className="text-sm font-medium text-text-secondary cursor-pointer hover:text-white transition-colors">Remember this device</label>
                </div>

                {/* Password Strength Meter (Simulated for Demo) */}
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${!register('password') ? 'bg-border-strong' : 'bg-brand-500'}`} />
                  ))}
                </div>

                {/* Simulated CAPTCHA */}
                <AnimatePresence>
                  {showCaptcha && (
                    <motion.div
                      className="mt-6 p-4 rounded-xl border border-border-strong bg-bg-base/80"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <p className="text-sm font-bold text-white mb-2">Security Verification Required</p>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 p-3 bg-bg-surface border border-border-default rounded flex items-center justify-between">
                          <span className="text-xs font-mono text-text-secondary">I am human</span>
                          <input
                            type="checkbox"
                            checked={captchaVerified}
                            onChange={(e) => setCaptchaVerified(e.target.checked)}
                            className="w-5 h-5"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 mt-6 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-glow-md transition-all flex items-center justify-center gap-2 border border-brand-400/50"
                >
                  {isLoading ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Authenticating…</>
                  ) : (
                    <>Secure Sign In <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>
              </form>
            </div>
          </div>


        </motion.div>
      </div>
    </div>
  )
}
