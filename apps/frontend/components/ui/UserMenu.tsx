'use client'
// ============================================================
// NETRA AI — UserMenu Component
// Dropdown menu for officer profile, settings, logout
// ============================================================

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, User, Settings, Shield, ChevronDown } from 'lucide-react'
import type { AuthenticatedOfficer, Role } from '@netra/types'
import { useAuth } from '@/lib/hooks/useAuth'
import { RoleBadge } from './RoleBadge'
import { useState } from 'react'
import { cn } from '@/lib/utils/cn'

import { useRouter } from 'next/navigation'

export function UserMenu({ officer }: { officer: AuthenticatedOfficer }) {
  const router = useRouter()
  const { logout } = useAuth()
  const [open, setOpen] = useState(false)

  // Use initials if no photo
  const initials = officer.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          className="
            flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-full
            bg-bg-elevated border border-border-subtle
            hover:border-border-default hover:bg-bg-overlay
            transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan
          "
          aria-label="User menu"
        >
          {/* Avatar circle */}
          <div className="w-7 h-7 rounded-full bg-brand-600/30 border border-brand-500/40
                          flex items-center justify-center text-xs font-bold text-brand-300">
            {initials}
          </div>
          
          <span className="hidden md:block text-body-sm font-medium text-text-primary pl-1 max-w-[120px] truncate">
            {officer.name.split(' ').slice(-1)[0]}
          </span>
          
          <ChevronDown
            className={cn('w-4 h-4 text-text-tertiary transition-transform duration-200', open && 'rotate-180')}
            strokeWidth={2}
          />
        </button>
      </DropdownMenu.Trigger>

      <AnimatePresence>
        {open && (
          <DropdownMenu.Portal forceMount>
            <DropdownMenu.Content
              asChild
              align="end"
              sideOffset={8}
              className="z-50 w-64 rounded-xl bg-bg-elevated/95 backdrop-blur-md border border-border-default shadow-card p-1"
            >
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.96 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
              >
                {/* Header section */}
                <div className="px-3 py-3 border-b border-border-subtle mb-1">
                  <p className="font-semibold text-body-md text-text-primary truncate">
                    {officer.name}
                  </p>
                  <p className="text-body-xs text-text-secondary truncate mt-0.5 mb-2 font-mono">
                    {officer.badge_number}
                  </p>
                  <div className="flex gap-2 items-center">
                    <RoleBadge role={officer.role as Role} size="sm" />
                    {officer.mfa_enabled && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded border border-green-500/30 bg-green-500/10 text-green-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                        <Shield className="w-3 h-3" /> MFA
                      </span>
                    )}
                  </div>
                </div>

                {/* Items */}
                <DropdownMenu.Item onClick={() => router.push('/dashboard/profile')} className="flex items-center gap-2.5 px-3 py-2 text-body-sm text-text-secondary hover:text-text-primary hover:bg-bg-overlay rounded-md cursor-pointer outline-none transition-colors">
                  <User className="w-4 h-4" />
                  My Profile
                </DropdownMenu.Item>

                <DropdownMenu.Item onClick={() => router.push('/dashboard/settings')} className="flex items-center gap-2.5 px-3 py-2 text-body-sm text-text-secondary hover:text-text-primary hover:bg-bg-overlay rounded-md cursor-pointer outline-none transition-colors">
                  <Settings className="w-4 h-4" />
                  Settings
                </DropdownMenu.Item>

                <DropdownMenu.Separator className="h-px bg-border-subtle my-1" />

                <DropdownMenu.Item
                  onClick={logout}
                  className="flex items-center gap-2.5 px-3 py-2 text-body-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md cursor-pointer outline-none transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </DropdownMenu.Item>
              </motion.div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        )}
      </AnimatePresence>
    </DropdownMenu.Root>
  )
}
