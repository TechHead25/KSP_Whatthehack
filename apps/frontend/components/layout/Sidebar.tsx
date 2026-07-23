'use client'
// ============================================================
// NETRA AI — Sidebar Navigation
// Role-aware collapsible sidebar per UI_DESIGN_SYSTEM.md §9
// ============================================================

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, BrainCircuit, AlertTriangle,
  FileText, Users, Search, GitCommitHorizontal,
  GitBranch, Map, BarChart3, Navigation,
  ClipboardList, Settings2, Shield, ChevronLeft,
  ChevronRight, Zap,
} from 'lucide-react'
import { NAV_CONFIG } from '@netra/config'
import type { NavItem, NavGroup } from '@netra/types'
import { useAuthStore } from '@/lib/stores/authStore'
import { usePermissions } from '@/lib/hooks/usePermissions'
import { cn } from '@/lib/utils/cn'

// ── Icon map ──────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard, BrainCircuit, AlertTriangle,
  FileText, Users, Search, GitCommitHorizontal,
  GitBranch, Map, BarChart3, Navigation,
  ClipboardList, Settings2, Shield,
}

// ── NavItem component ─────────────────────────────────────────

function SidebarNavItem({
  item,
  collapsed,
}: {
  item: NavItem
  collapsed: boolean
}) {
  const pathname = usePathname()
  const { role, can } = usePermissions()

  // Permission check
  if (item.requiredPermissions?.length) {
    const hasPerm = item.requiredPermissions.some((p) => can(p))
    if (!hasPerm) return null
  }

  // Role check
  if (item.allowedRoles?.length && role && !item.allowedRoles.includes(role)) {
    return null
  }

  const isActive =
    item.href === '/dashboard'
      ? pathname === '/dashboard'
      : pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
  const Icon = ICON_MAP[item.icon] ?? LayoutDashboard

  return (
    <Link
      href={item.href}
      className={cn(
        'nav-item relative group flex items-center py-2.5 rounded-lg mb-1',
        isActive ? 'bg-bg-elevated text-brand-300 font-bold border border-brand-500/20 shadow-glow-sm' : 'text-text-secondary hover:bg-bg-elevated/50 hover:text-white',
        collapsed ? 'justify-center px-2' : 'px-3 gap-3'
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon
        className={cn(
          'w-4 h-4 flex-shrink-0 transition-colors',
          isActive ? 'text-brand-400' : 'text-text-tertiary group-hover:text-brand-300'
        )}
        strokeWidth={isActive ? 2 : 1.75}
      />

      {!collapsed && (
        <>
          <span className="flex-1 truncate text-body-md">{item.label}</span>

          {/* NEW badge */}
          {item.isNew && (
            <span className="px-1.5 py-0.5 rounded text-body-xs font-medium
                             bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30">
              NEW
            </span>
          )}

          {/* Alert count badge */}
          {item.badge && (
            <span className="px-1.5 py-0.5 rounded-full text-body-xs font-medium
                             bg-red-500/20 text-red-300">
              {item.badge}
            </span>
          )}
        </>
      )}

      {/* Collapsed tooltip */}
      {collapsed && (
        <div className="
          absolute left-full ml-3 px-2.5 py-1.5 rounded-lg
          bg-bg-elevated border border-border-default text-text-primary text-body-sm
          whitespace-nowrap pointer-events-none
          opacity-0 group-hover:opacity-100 transition-opacity duration-150
          z-50 shadow-card
        ">
          {item.label}
          {item.isNew && (
            <span className="ml-2 text-accent-cyan text-body-xs">NEW</span>
          )}
        </div>
      )}
    </Link>
  )
}

// ── NavGroup component ────────────────────────────────────────

function SidebarNavGroup({ group, collapsed }: { group: NavGroup; collapsed: boolean }) {
  return (
    <div className="mb-4">
      {!collapsed && (
        <p className="px-3 mb-2 text-[10px] font-black tracking-[0.2em] uppercase text-text-tertiary">
          {group.label}
        </p>
      )}
      <div className="space-y-0.5">
        {group.items.map((item) => (
          <SidebarNavItem key={item.id} item={item} collapsed={collapsed} />
        ))}
      </div>
    </div>
  )
}

// ── Main Sidebar ──────────────────────────────────────────────

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const officer = useAuthStore((s) => s.officer)

  const toggleCollapse = useCallback(() => setCollapsed((v) => !v), [])

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="
        relative flex flex-col h-full
        bg-bg-surface border-r border-border-subtle
        overflow-hidden flex-shrink-0
      "
      aria-label="Sidebar navigation"
    >
      {/* ── Logo ──────────────────────────────────────────── */}
      <div className={cn(
        'flex items-center h-16 border-b border-border-strong flex-shrink-0 bg-bg-surface/90 backdrop-blur-md',
        collapsed ? 'justify-center px-2' : 'px-5 gap-3'
      )}>
        <div className="flex items-center justify-center w-8 h-8 rounded-lg
                        bg-gradient-to-br from-brand-600/30 to-bg-base border border-brand-500/30 flex-shrink-0 shadow-glow-sm">
          <Zap className="w-4 h-4 text-brand-400" strokeWidth={2.5} />
        </div>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <span className="font-black text-lg tracking-tight whitespace-nowrap text-white">
                NETRA <span className="text-brand-400">AI</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-6 space-y-2">
        {NAV_CONFIG.map((group) => (
          <SidebarNavGroup key={group.id} group={group} collapsed={collapsed} />
        ))}
      </nav>

      {/* ── Officer mini-profile ───────────────────────────── */}
      {officer && (
        <div className={cn(
          'flex items-center border-t border-border-subtle flex-shrink-0 py-3',
          collapsed ? 'justify-center px-2' : 'px-3 gap-3'
        )}>
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-brand-600/30 border border-brand-500/40
                          flex items-center justify-center flex-shrink-0 text-body-sm
                          font-semibold text-brand-300">
            {officer.name.charAt(0)}
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-w-0 flex-1"
              >
                <p className="text-body-sm font-medium text-text-primary truncate">
                  {officer.name.split(' ').slice(-1)[0]}
                </p>
                <p className="text-body-xs text-text-tertiary truncate">
                  {officer.station.name}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ── Collapse toggle ────────────────────────────────── */}
      <button
        onClick={toggleCollapse}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="
          absolute top-[4.5rem] -right-3 z-10
          flex items-center justify-center w-6 h-6
          rounded-full bg-bg-elevated border border-border-default
          text-text-tertiary hover:text-text-primary
          transition-colors shadow-card
        "
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
    </motion.aside>
  )
}
