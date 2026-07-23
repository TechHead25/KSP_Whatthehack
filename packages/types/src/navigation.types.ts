// ============================================================
// NETRA AI — Navigation Types
// ============================================================

import type { Permission, Role } from './auth.types'

/** A single navigation item in the sidebar */
export interface NavItem {
  id: string
  label: string
  href: string
  icon: string             // Lucide icon name
  badge?: string | number  // e.g. alert count
  badgeVariant?: 'default' | 'destructive' | 'warning'
  /** Roles that can see this item. Empty = all roles */
  allowedRoles?: Role[]
  /** Permissions required — officer must have at least one */
  requiredPermissions?: Permission[]
  children?: NavItem[]
  isExternal?: boolean
  isNew?: boolean
}

/** Navigation group (section in sidebar) */
export interface NavGroup {
  id: string
  label: string
  items: NavItem[]
}

/** Breadcrumb segment */
export interface BreadcrumbSegment {
  label: string
  href?: string
}

/** Command palette item */
export interface CommandItem {
  id: string
  label: string
  description?: string
  icon?: string
  href?: string
  action?: () => void
  shortcut?: string[]
  group: string
  requiredPermissions?: Permission[]
}
