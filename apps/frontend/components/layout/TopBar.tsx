'use client'
// ============================================================
// NETRA AI — Top Bar / Header
// Search, alerts bell, command palette trigger, user menu
// ============================================================

import { motion } from 'framer-motion'
import { Search, Command, Menu } from 'lucide-react'
import { useAuthStore } from '@/lib/stores/authStore'
import { RoleBadge } from '@/components/ui/RoleBadge'
import { UserMenu } from '@/components/ui/UserMenu'
import { NotificationBell } from '@/components/ui/NotificationBell'
import { KSPLogo } from '@/components/KSPLogo'
import type { Role } from '@netra/types'

interface TopBarProps {
  onCommandPalette: () => void
  onMobileSidebar?: () => void
}

export function TopBar({ onCommandPalette, onMobileSidebar }: TopBarProps) {
  const officer = useAuthStore((s) => s.officer)

  return (
    <header
      className="
        flex items-center justify-between h-16 px-6 md:px-8
        bg-bg-base/90 border-b border-border-strong
        backdrop-blur-xl flex-shrink-0 shadow-sm
      "
      role="banner"
    >
      {/* ── Left: mobile menu + platform name ──────────────── */}
      <div className="flex items-center gap-3">
        {/* Mobile sidebar toggle */}
        <button
          onClick={onMobileSidebar}
          className="md:hidden btn-ghost p-2"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-brand-500/40 shadow-glow-sm">
            <KSPLogo className="w-full h-full object-cover" />
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-bg-surface border border-border-strong px-3 py-1.5 rounded-full shadow-inner">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
            <span className="text-[10px] font-bold text-white uppercase tracking-[0.15em]">
              Karnataka State Police · Secure Command
            </span>
          </div>
        </div>

      </div>

      {/* ── Center: Search / Command Palette ───────────────── */}
      <motion.button
        id="tour-command-palette"
        onClick={onCommandPalette}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="
          flex items-center gap-3 px-4 py-2 rounded-xl
          bg-bg-surface border border-border-strong shadow-inner
          hover:border-brand-500/50 hover:bg-bg-elevated
          text-text-tertiary hover:text-white
          transition-all duration-300
          w-full max-w-sm hidden md:flex group
        "
        aria-label="Open command palette (Ctrl+K)"
      >
        <Search className="w-4 h-4 flex-shrink-0 group-hover:text-brand-400 transition-colors" strokeWidth={2} />
        <span className="text-sm font-medium flex-1 text-left tracking-wide">Search intelligence…</span>
        <kbd className="flex items-center gap-1 text-[10px] font-mono font-bold bg-bg-base border border-border-strong px-1.5 py-0.5 rounded text-text-secondary">
          <Command className="w-3 h-3" />K
        </kbd>
      </motion.button>

      {/* ── Right: alerts + profile ────────────────────────── */}
      <div className="flex items-center gap-2">
        {/* Role badge — desktop only */}
        {officer?.role && (
          <div className="hidden lg:block">
            <RoleBadge role={officer.role as Role} size="sm" />
          </div>
        )}

        {/* Notification bell */}
        <NotificationBell />

        {/* User menu */}
        {officer && <UserMenu officer={officer} />}
      </div>
    </header>
  )
}
