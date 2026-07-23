// ============================================================
// NETRA AI — RBAC Roles & Permissions Configuration
// Source: MASTER_PRD.md F-001, SECURITY.md §4.2
// FROZEN — Do not modify without user instruction
// ============================================================

import type { Role, Permission, JurisdictionScope } from '@netra/types'

// ── Role display metadata ────────────────────────────────────

export interface RoleMeta {
  label: string
  description: string
  color: string          // Tailwind color class
  badgeClass: string     // Full badge class string
  jurisdictionScope: JurisdictionScope
  mfaRequired: boolean
}

export const ROLE_META: Record<Role, RoleMeta> = {
  SUPER_ADMIN: {
    label: 'Super Admin',
    description: 'Full platform access',
    color: 'text-purple-400',
    badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    jurisdictionScope: 'NATIONAL',
    mfaRequired: true,
  },
  STATE_ADMIN: {
    label: 'State Admin',
    description: 'State-wide intelligence access',
    color: 'text-amber-400',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    jurisdictionScope: 'NATIONAL',
    mfaRequired: true,
  },
  DISTRICT_ADMIN: {
    label: 'District Admin',
    description: 'District intelligence & operations',
    color: 'text-blue-400',
    badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    jurisdictionScope: 'DISTRICT',
    mfaRequired: true,
  },
  INVESTIGATION_OFFICER: {
    label: 'Investigation Officer',
    description: 'Station investigation management',
    color: 'text-cyan-400',
    badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    jurisdictionScope: 'STATION',
    mfaRequired: true,
  },
  POLICE_OFFICER: {
    label: 'Police Officer',
    description: 'Patrol operations — read only',
    color: 'text-green-400',
    badgeClass: 'bg-green-500/15 text-green-300 border-green-500/30',
    jurisdictionScope: 'STATION',
    mfaRequired: false,
  },
  READ_ONLY_OFFICER: {
    label: 'Read Only Officer',
    description: 'Legal case file access',
    color: 'text-rose-400',
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    jurisdictionScope: 'NATIONAL',
    mfaRequired: false,
  },
  AUDITOR: {
    label: 'Auditor',
    description: 'Analytics & AI query access',
    color: 'text-indigo-400',
    badgeClass: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    jurisdictionScope: 'NATIONAL',
    mfaRequired: false,
  },
}

// ── Permission matrix per SECURITY.md §4.2 ──────────────────

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    'READ_ALL_FIRS', 'READ_DISTRICT_FIRS', 'READ_STATION_FIRS', 'WRITE_FIRS',
    'READ_ALL_SUSPECTS', 'READ_DISTRICT_SUSPECTS', 'READ_STATION_SUSPECTS', 'WRITE_SUSPECTS',
    'VIEW_CRIMINAL_NETWORK', 'VIEW_HEATMAP', 'VIEW_ANALYTICS', 'GENERATE_REPORTS',
    'USE_AI_ASSISTANT', 'MANAGE_OFFICERS', 'VIEW_AUDIT_LOGS', 'MANAGE_ALERTS',
    'VIEW_EVIDENCE', 'MANAGE_PATROL',
  ],
  STATE_ADMIN: [
    'READ_ALL_FIRS', 'READ_DISTRICT_FIRS', 'READ_STATION_FIRS',
    'READ_ALL_SUSPECTS', 'READ_DISTRICT_SUSPECTS', 'READ_STATION_SUSPECTS',
    'VIEW_CRIMINAL_NETWORK', 'VIEW_HEATMAP', 'VIEW_ANALYTICS', 'GENERATE_REPORTS',
    'USE_AI_ASSISTANT', 'VIEW_AUDIT_LOGS', 'MANAGE_ALERTS', 'VIEW_EVIDENCE', 'MANAGE_PATROL',
  ],
  DISTRICT_ADMIN: [
    'READ_DISTRICT_FIRS', 'READ_STATION_FIRS', 'WRITE_FIRS',
    'READ_DISTRICT_SUSPECTS', 'READ_STATION_SUSPECTS', 'WRITE_SUSPECTS',
    'VIEW_CRIMINAL_NETWORK', 'VIEW_HEATMAP', 'VIEW_ANALYTICS', 'GENERATE_REPORTS',
    'USE_AI_ASSISTANT', 'VIEW_AUDIT_LOGS', 'MANAGE_ALERTS', 'VIEW_EVIDENCE', 'MANAGE_PATROL',
  ],
  INVESTIGATION_OFFICER: [
    'READ_STATION_FIRS', 'WRITE_FIRS',
    'READ_STATION_SUSPECTS', 'WRITE_SUSPECTS',
    'VIEW_CRIMINAL_NETWORK', 'VIEW_HEATMAP', 'VIEW_ANALYTICS', 'GENERATE_REPORTS',
    'USE_AI_ASSISTANT', 'MANAGE_ALERTS', 'VIEW_EVIDENCE', 'MANAGE_PATROL',
  ],
  POLICE_OFFICER: [
    'READ_STATION_FIRS', 'READ_STATION_SUSPECTS',
    'VIEW_HEATMAP', 'MANAGE_ALERTS',
  ],
  READ_ONLY_OFFICER: [
    'READ_STATION_FIRS', 'READ_DISTRICT_FIRS', 'READ_ALL_FIRS',
    'READ_STATION_SUSPECTS', 'VIEW_CRIMINAL_NETWORK',
    'GENERATE_REPORTS', 'USE_AI_ASSISTANT', 'VIEW_EVIDENCE',
  ],
  AUDITOR: [
    'READ_STATION_FIRS', 'READ_DISTRICT_FIRS', 'READ_ALL_FIRS',
    'READ_STATION_SUSPECTS', 'READ_DISTRICT_SUSPECTS', 'READ_ALL_SUSPECTS',
    'VIEW_CRIMINAL_NETWORK', 'VIEW_HEATMAP', 'VIEW_ANALYTICS',
    'USE_AI_ASSISTANT', 'GENERATE_REPORTS',
  ],
}

// ── Helper functions ─────────────────────────────────────────

/** Check if a role has a specific permission */
export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

/** Check if a role has ANY of the given permissions */
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p))
}

/** Check if a role has ALL of the given permissions */
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p))
}

/** Get jurisdiction scope for a role */
export function getJurisdictionScope(role: Role): JurisdictionScope {
  return ROLE_META[role].jurisdictionScope
}

/** Roles requiring MFA per SECURITY.md §3.3 */
export const MFA_REQUIRED_ROLES: Role[] = ['SUPER_ADMIN', 'STATE_ADMIN', 'DISTRICT_ADMIN', 'INVESTIGATION_OFFICER']

/** Check if a role requires MFA */
export function requiresMFA(role: Role): boolean {
  return MFA_REQUIRED_ROLES.includes(role)
}
