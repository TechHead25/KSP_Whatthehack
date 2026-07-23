// ============================================================
// NETRA AI — usePermissions Hook
// RBAC permission checks for UI components
// ============================================================
'use client'

import { useCallback } from 'react'
import { useAuthStore, selectPermissions, selectRole } from '../stores/authStore'
import { hasPermission, hasAnyPermission, hasAllPermissions } from '@netra/config'
import type { Permission, Role } from '@netra/types'

export function usePermissions() {
  const role = useAuthStore(selectRole) as Role | null
  const permissions = useAuthStore(selectPermissions) as Permission[]

  const can = useCallback(
    (permission: Permission): boolean => {
      if (!role) return false
      return hasPermission(role, permission)
    },
    [role]
  )

  const canAny = useCallback(
    (perms: Permission[]): boolean => {
      if (!role) return false
      return hasAnyPermission(role, perms)
    },
    [role]
  )

  const canAll = useCallback(
    (perms: Permission[]): boolean => {
      if (!role) return false
      return hasAllPermissions(role, perms)
    },
    [role]
  )

  const isRole = useCallback(
    (...roles: Role[]): boolean => {
      if (!role) return false
      return roles.includes(role)
    },
    [role]
  )

  const isAtLeast = useCallback(
    (minimumRole: Role): boolean => {
      const hierarchy: Role[] = [
        'READ_ONLY_OFFICER',
        'POLICE_OFFICER',
        'INVESTIGATION_OFFICER',
        'AUDITOR',
        'DISTRICT_ADMIN',
        'STATE_ADMIN',
        'SUPER_ADMIN',
      ]
      if (!role) return false
      return hierarchy.indexOf(role) >= hierarchy.indexOf(minimumRole)
    },
    [role]
  )

  return { role, permissions, can, canAny, canAll, isRole, isAtLeast }
}
