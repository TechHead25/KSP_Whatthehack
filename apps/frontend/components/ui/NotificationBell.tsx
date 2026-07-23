'use client'
// ============================================================
// NETRA AI — NotificationBell Component
// Popover for system alerts and early warnings
// ============================================================

import { useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, AlertTriangle, Radio } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

// Dummy notifications for UI shell demonstration
const DEMO_NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'High-Risk Suspect Detected',
    message: 'Raju Naik spotted near Indiranagar Metro Station.',
    time: '2m ago',
    type: 'critical',
  },
  {
    id: 'n2',
    title: 'New Hotspot Predicted',
    message: 'Vehicle theft spike predicted in Sector 4 tonight.',
    time: '1h ago',
    type: 'warning',
  },
  {
    id: 'n3',
    title: 'System Update',
    message: 'AI models retrained successfully.',
    time: '3h ago',
    type: 'info',
  },
]

import { useRouter } from 'next/navigation'

export function NotificationBell() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const unreadCount = DEMO_NOTIFICATIONS.length

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          className="relative p-2 rounded-full text-text-tertiary hover:text-text-primary hover:bg-bg-elevated transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan"
          aria-label="View notifications"
        >
          <Bell className="w-5 h-5" strokeWidth={1.5} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-bg-surface rounded-full animate-pulse-ring" />
          )}
        </button>
      </Popover.Trigger>

      <AnimatePresence>
        {open && (
          <Popover.Portal forceMount>
            <Popover.Content
              asChild
              align="end"
              sideOffset={8}
              className="z-50 w-80 sm:w-96 rounded-xl bg-bg-elevated/95 backdrop-blur-md border border-border-default shadow-card overflow-hidden"
            >
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.96 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle bg-bg-surface/50">
                  <h3 className="text-body-sm font-semibold text-text-primary flex items-center gap-2">
                    <Radio className="w-4 h-4 text-accent-cyan" />
                    Early Warning System
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300">
                    {unreadCount} New
                  </span>
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                  {DEMO_NOTIFICATIONS.map((notif) => (
                    <div
                      key={notif.id}
                      className={cn(
                        'px-4 py-3 border-b border-border-subtle hover:bg-bg-overlay transition-colors cursor-pointer',
                        notif.type === 'critical' && 'bg-red-500/5 hover:bg-red-500/10'
                      )}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className={cn(
                          'text-body-sm font-medium flex items-center gap-1.5',
                          notif.type === 'critical' ? 'text-red-400' :
                          notif.type === 'warning' ? 'text-amber-400' : 'text-text-primary'
                        )}>
                          {notif.type === 'critical' && <AlertTriangle className="w-3.5 h-3.5" />}
                          {notif.title}
                        </span>
                        <span className="text-body-xs text-text-tertiary whitespace-nowrap ml-2">
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-body-sm text-text-secondary leading-snug">
                        {notif.message}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-2 border-t border-border-subtle bg-bg-surface/50">
                  <button onClick={() => router.push('/dashboard/notifications')} className="w-full py-1.5 text-center text-body-xs text-brand-400 hover:text-brand-300 transition-colors font-medium">
                    View All Alerts
                  </button>
                </div>
              </motion.div>
            </Popover.Content>
          </Popover.Portal>
        )}
      </AnimatePresence>
    </Popover.Root>
  )
}
