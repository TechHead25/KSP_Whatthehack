import { useState, useEffect, useCallback, useRef } from 'react'
import { useAuth } from './useAuth'

const WARNING_TIME = 4 * 60 * 1000 // 4 minutes
const LOGOUT_TIME = 5 * 60 * 1000  // 5 minutes

export function useSessionTimeout() {
  const { logout, isAuthenticated } = useAuth()
  const [showWarning, setShowWarning] = useState(false)
  const warningTimer = useRef<NodeJS.Timeout | null>(null)
  const logoutTimer = useRef<NodeJS.Timeout | null>(null)

  const clearTimers = useCallback(() => {
    if (warningTimer.current) clearTimeout(warningTimer.current)
    if (logoutTimer.current) clearTimeout(logoutTimer.current)
  }, [])

  const resetTimers = useCallback(() => {
    if (!isAuthenticated) return

    clearTimers()
    setShowWarning(false)

    warningTimer.current = setTimeout(() => {
      setShowWarning(true)
    }, WARNING_TIME)

    logoutTimer.current = setTimeout(() => {
      logout()
    }, LOGOUT_TIME)
  }, [isAuthenticated, clearTimers, logout])

  useEffect(() => {
    if (!isAuthenticated) {
      clearTimers()
      return
    }

    const events = ['mousemove', 'keydown', 'scroll', 'click']
    const handleActivity = () => {
      if (!showWarning) {
        resetTimers()
      }
    }

    events.forEach((event) => window.addEventListener(event, handleActivity))
    resetTimers()

    return () => {
      events.forEach((event) => window.removeEventListener(event, handleActivity))
      clearTimers()
    }
  }, [isAuthenticated, showWarning, resetTimers, clearTimers])

  const extendSession = useCallback(() => {
    setShowWarning(false)
    resetTimers()
    // optionally call backend /auth/refresh here if needed
  }, [resetTimers])

  return { showWarning, extendSession }
}
