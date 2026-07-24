import type { Permission, Role } from './auth.types'

export interface NavItem {
  id: string
  label: string
  href: string
  icon: string
  badge?: string | number
  badgeVariant?: 'default' | 'destructive' | 'warning'
  allowedRoles?: Role[]
  requiredPermissions?: Permission[]
  children?: NavItem[]
  isExternal?: boolean
  isNew?: boolean
}

export interface NavGroup {
  id: string
  label: string
  items: NavItem[]
}

export interface BreadcrumbSegment {
  label: string
  href?: string
}

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
