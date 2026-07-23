'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { authApi } from '@/lib/api/authApi'
import { clearAuthCookies, hasRouteAccess, isPublicPath, AUTH_SESSION_COOKIE, isValidSessionCookie } from '@/lib/auth/session'
import { useAuthStore } from '@/lib/stores/authStore'

interface AuthGuardProps {
  children: React.ReactNode
}

function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') {
    return null
  }

  const cookies = document.cookie.split(';')
  const cookie = cookies.find((entry) => entry.trim().startsWith(`${name}=`))
  return cookie ? decodeURIComponent(cookie.split('=').slice(1).join('=').trim()) : null
}

export function AuthGuard({ children }: AuthGuardProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const officer = useAuthStore((state) => state.officer)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const accessToken = useAuthStore((state) => state.accessToken)

  useEffect(() => {
    let isUnmounted = false

    const handleRefreshLogout = () => {
      clearAuthCookies()
      useAuthStore.getState().logout()
      useAuthStore.persist.clearStorage()
    }

    const validateSession = async () => {
      const isPublicRoute = isPublicPath(pathname)
      if (isPublicRoute) {
        if (!isUnmounted) {
          setReady(true)
        }
        return
      }

      const sessionCookie = getCookieValue(AUTH_SESSION_COOKIE)
      if (!isValidSessionCookie(sessionCookie) || !isAuthenticated || !accessToken || !officer) {
        handleRefreshLogout()
        if (!isUnmounted) {
          router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
        }
        return
      }

      if (!hasRouteAccess(pathname, officer.role)) {
        if (!isUnmounted) {
          router.replace('/forbidden')
        }
        return
      }

      try {
        await authApi.refresh()
      } catch {
        handleRefreshLogout()
        if (!isUnmounted) {
          router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
        }
        return
      }

      if (!isUnmounted) {
        setReady(true)
      }
    }

    void validateSession()

    window.addEventListener('beforeunload', handleRefreshLogout)

    return () => {
      isUnmounted = true
      window.removeEventListener('beforeunload', handleRefreshLogout)
    }
  }, [accessToken, isAuthenticated, officer, pathname, router])

  if (!ready && !isPublicPath(pathname)) {
    return null
  }

  return <>{children}</>
}
