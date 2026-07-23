// ============================================================
// NETRA AI — Middleware
// Enforces authentication and role-based access before pages render.
// ============================================================
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Role } from '@netra/types'
import {
  AUTH_ROLE_COOKIE,
  AUTH_SESSION_COOKIE,
  hasRouteAccess,
  isPublicPath,
  isRoleProtectedPath,
  isValidSessionCookie,
} from '@/lib/auth/session'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  const sessionCookie = request.cookies.get(AUTH_SESSION_COOKIE)?.value ?? null
  const roleCookie = request.cookies.get(AUTH_ROLE_COOKIE)?.value ?? null

  if (!isValidSessionCookie(sessionCookie)) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isRoleProtectedPath(pathname) && !hasRouteAccess(pathname, roleCookie as Role | null)) {
    return NextResponse.redirect(new URL('/forbidden', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
}
