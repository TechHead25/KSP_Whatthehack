// ============================================================
// NETRA AI — Enterprise Middleware
// Enforces strict authentication, route protection, and RBAC before page rendering.
// ============================================================
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Role } from '@netra/types'
import {
  AUTH_ROLE_COOKIE,
  AUTH_SESSION_COOKIE,
  TOP_LEVEL_ROUTE_MAP,
  hasRouteAccess,
  isPublicPath,
  isRoleProtectedPath,
  isValidSessionCookie,
} from '@/lib/auth/session'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow static assets, Next internal files, and favicon
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/api/')
  ) {
    return NextResponse.next()
  }

  // Public page routes allowed without auth
  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  // Validate session cookie
  const sessionCookie = request.cookies.get(AUTH_SESSION_COOKIE)?.value ?? null
  const roleCookie = (request.cookies.get(AUTH_ROLE_COOKIE)?.value ?? null) as Role | null

  if (!isValidSessionCookie(sessionCookie)) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Handle top-level protected alias routes (e.g., /admin, /reports, /analytics, /users, etc.)
  if (pathname in TOP_LEVEL_ROUTE_MAP) {
    const targetPath = TOP_LEVEL_ROUTE_MAP[pathname]
    if (hasRouteAccess(targetPath, roleCookie)) {
      return NextResponse.redirect(new URL(targetPath, request.url))
    }
    return NextResponse.redirect(new URL('/forbidden', request.url))
  }

  // Enforce RBAC on dashboard routes
  if (isRoleProtectedPath(pathname) && !hasRouteAccess(pathname, roleCookie)) {
    return NextResponse.redirect(new URL('/forbidden', request.url))
  }

  // Attach browser security headers to prevent caching protected responses
  const response = NextResponse.next()
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
