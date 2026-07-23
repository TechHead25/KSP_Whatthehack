// ============================================================
// NETRA AI — useAuth Hook
// Primary auth hook for all components
// ============================================================
'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuthStore } from '../stores/authStore'
import { authApi } from '../api/authApi'
import { clearAuthCookies, setAuthCookies } from '@/lib/auth/session'
import type { LoginRequest, MFAVerifyRequest } from '@netra/types'

export function useAuth() {
  const router = useRouter()
  const store = useAuthStore()

  const login = useCallback(
    async (credentials: LoginRequest) => {
      store.setLoading(true)
      store.setError(null)

      try {


        const result = await authApi.login(credentials)

        if (result.mfa_required && result.temp_token) {
          store.setMFAPending(result.temp_token)
          router.push('/mfa')
          return { success: true, mfaRequired: true }
        }

        if (result.officer && result.access_token) {
          store.setOfficer(result.officer, result.access_token)
          setAuthCookies(result.officer.role)

          toast.success(`Welcome back, ${result.officer.name.split(' ')[0]}`)
          if (result.officer.badge_number.toLowerCase() === 'admin') {
              router.push('/dashboard/admin')
          } else {
              router.push('/dashboard')
          }
          return { success: true, mfaRequired: false }
        }

        throw new Error('Unexpected login response')
      } catch (err: unknown) {
        const msg = extractErrorMessage(err) ?? 'Login failed. Please try again.'
        store.setError(msg)
        toast.error(msg)
        return { success: false, mfaRequired: false }
      } finally {
        store.setLoading(false)
      }
    },
    [store, router]
  )

  const verifyMFA = useCallback(
    async (body: MFAVerifyRequest) => {
      store.setLoading(true)
      store.setError(null)

      try {
        const result = await authApi.verifyMFA(body)

        if (result.officer && result.access_token) {
          store.setOfficer(result.officer, result.access_token)
          setAuthCookies(result.officer.role)

          toast.success('Authentication successful')
          router.push('/dashboard')
          return { success: true }
        }

        throw new Error('MFA verification failed')
      } catch (err: unknown) {
        const msg = extractErrorMessage(err) ?? 'Invalid OTP code. Please try again.'
        store.setError(msg)
        toast.error(msg)
        return { success: false }
      } finally {
        store.setLoading(false)
      }
    },
    [store, router]
  )

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      // Silently fail — logout locally regardless
    } finally {
      clearAuthCookies()
      store.logout()
      router.push('/login')
      toast.info('You have been logged out')
    }
  }, [store, router])

  return {
    officer: store.officer,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    isMFAPending: store.isMFAPending,
    tempToken: store.tempToken,
    error: store.error,
    login,
    verifyMFA,
    logout,
  }
}

function extractErrorMessage(err: unknown): string | null {
  if (err && typeof err === 'object') {
    const e = err as Record<string, unknown>
    const response = e['response'] as Record<string, unknown> | undefined
    const data = response?.['data'] as Record<string, unknown> | undefined
    const error = data?.['error'] as Record<string, unknown> | undefined
    if (typeof error?.['message'] === 'string') return error['message']
    if (typeof e['message'] === 'string') return e['message']
  }
  return null
}
