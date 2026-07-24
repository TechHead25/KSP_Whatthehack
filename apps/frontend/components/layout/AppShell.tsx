'use client'
// ============================================================
// NETRA AI — App Shell Orchestrator
// Coordinates Sidebar, TopBar, and main content area
// ============================================================

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { Breadcrumbs } from './Breadcrumbs'
import { CommandPalette } from '../ui/CommandPalette'
import { useAuthStore } from '@/lib/stores/authStore'
import { useRouter, usePathname } from 'next/navigation'

export function AppShell({ children }: { children: React.ReactNode }) {
  const [cmdOpen, setCmdOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const router = useRouter()
  const pathname = usePathname()

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Ctrl+K to open command palette
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCmdOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  // Handle auth redirect safely in effect
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login')
    }
  }, [mounted, isAuthenticated, router])

  if (!mounted || !isAuthenticated) return null

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base text-text-primary">
      {/* ── Mobile Sidebar Overlay ─────────────────────────── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-64 md:hidden shadow-2xl"
            >
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Desktop Sidebar ────────────────────────────────── */}
      <div className="hidden md:flex flex-shrink-0 z-30">
        <Sidebar />
      </div>

      {/* ── Main Content Area ──────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative z-0">
        <TopBar
          onCommandPalette={() => setCmdOpen(true)}
          onMobileSidebar={() => setMobileMenuOpen(true)}
        />
        
        {/* Sub-header for breadcrumbs */}
        <div className="h-10 px-4 md:px-6 flex items-center border-b border-border-subtle bg-bg-surface/40 flex-shrink-0">
          <Breadcrumbs />
        </div>

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 scroll-smooth">
          <motion.div
            key={pathname} // Triggers animation on route change
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="h-full w-full max-w-screen-2xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* ── Global Command Palette ─────────────────────────── */}
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
    </div>
  )
}
