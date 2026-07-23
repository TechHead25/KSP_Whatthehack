import type { Role } from '@netra/types'

export const AUTH_SESSION_COOKIE = 'netra-session'
export const AUTH_ROLE_COOKIE = 'netra-role'
export const AUTH_SESSION_TTL_MS = 15 * 60 * 1000

export const PUBLIC_PATHS = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/mfa',
  '/forbidden',
  '/_next',
  '/favicon.ico',
  '/api',
]

const ROLE_PROTECTED_PREFIXES: Array<{ prefix: string; allowedRoles: Role[] }> = [
  { prefix: '/dashboard/admin', allowedRoles: ['SUPER_ADMIN'] },
  { prefix: '/dashboard/users', allowedRoles: ['SUPER_ADMIN', 'STATE_ADMIN', 'DISTRICT_ADMIN'] },
  { prefix: '/dashboard/settings', allowedRoles: ['SUPER_ADMIN', 'STATE_ADMIN', 'DISTRICT_ADMIN', 'INVESTIGATION_OFFICER', 'POLICE_OFFICER'] },
  { prefix: '/dashboard/reports', allowedRoles: ['SUPER_ADMIN', 'STATE_ADMIN', 'DISTRICT_ADMIN', 'INVESTIGATION_OFFICER', 'AUDITOR'] },
  { prefix: '/dashboard/analytics', allowedRoles: ['SUPER_ADMIN', 'STATE_ADMIN', 'DISTRICT_ADMIN', 'INVESTIGATION_OFFICER', 'AUDITOR'] },
  { prefix: '/dashboard/intelligence', allowedRoles: ['SUPER_ADMIN', 'STATE_ADMIN', 'DISTRICT_ADMIN', 'INVESTIGATION_OFFICER'] },
  { prefix: '/dashboard/incidents', allowedRoles: ['SUPER_ADMIN', 'STATE_ADMIN', 'DISTRICT_ADMIN', 'INVESTIGATION_OFFICER'] },
  { prefix: '/dashboard/evidence', allowedRoles: ['SUPER_ADMIN', 'STATE_ADMIN', 'DISTRICT_ADMIN', 'INVESTIGATION_OFFICER', 'READ_ONLY_OFFICER'] },
  { prefix: '/dashboard/suspects', allowedRoles: ['SUPER_ADMIN', 'STATE_ADMIN', 'DISTRICT_ADMIN', 'INVESTIGATION_OFFICER'] },
  { prefix: '/dashboard/graph', allowedRoles: ['SUPER_ADMIN', 'STATE_ADMIN', 'DISTRICT_ADMIN', 'INVESTIGATION_OFFICER', 'AUDITOR'] },
  { prefix: '/dashboard/heatmap', allowedRoles: ['SUPER_ADMIN', 'STATE_ADMIN', 'DISTRICT_ADMIN', 'INVESTIGATION_OFFICER', 'AUDITOR'] },
  { prefix: '/dashboard/patrol', allowedRoles: ['SUPER_ADMIN', 'STATE_ADMIN', 'DISTRICT_ADMIN', 'INVESTIGATION_OFFICER'] },
  { prefix: '/dashboard/audit', allowedRoles: ['SUPER_ADMIN', 'STATE_ADMIN', 'DISTRICT_ADMIN'] },
]

export function isPublicPath(pathname: string): boolean {
  if (pathname === '/') {
    return true
  }

  return PUBLIC_PATHS.some((publicPath) => pathname === publicPath || pathname.startsWith(`${publicPath}/`))
}

export function isRoleProtectedPath(pathname: string): boolean {
  return ROLE_PROTECTED_PREFIXES.some(({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}

export function hasRouteAccess(pathname: string, role: Role | null): boolean {
  if (!isRoleProtectedPath(pathname)) {
    return true
  }

  if (!role) {
    return false
  }

  const protection = ROLE_PROTECTED_PREFIXES.find(({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`))
  return protection?.allowedRoles.includes(role) ?? false
}

export function createSessionCookieValue(): string {
  return `active:${Date.now().toString()}`
}

export function isValidSessionCookie(value: string | null | undefined): boolean {
  if (!value) {
    return false
  }

  const [state, issuedAt] = value.split(':')
  if (state !== 'active' || !issuedAt) {
    return false
  }

  const issued = Number(issuedAt)
  if (!Number.isFinite(issued)) {
    return false
  }

  return Date.now() - issued <= AUTH_SESSION_TTL_MS
}

export function setAuthCookies(role: Role): void {
  const sessionValue = createSessionCookieValue()
  document.cookie = `${AUTH_SESSION_COOKIE}=${encodeURIComponent(sessionValue)}; path=/; max-age=900; samesite=lax`
  document.cookie = `${AUTH_ROLE_COOKIE}=${role}; path=/; max-age=900; samesite=lax`
}

export function clearAuthCookies(): void {
  document.cookie = `${AUTH_SESSION_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  document.cookie = `${AUTH_ROLE_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
}
