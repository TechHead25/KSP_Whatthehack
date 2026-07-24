'use client'

import { useEffect } from 'react'
import { useSyncStore, type RealtimeEvent } from '@/lib/stores/syncStore'
import { toast } from 'sonner'

export function RealtimeSyncListener() {
  const syncFromExternal = useSyncStore(s => s.syncFromExternal)

  useEffect(() => {
    if (typeof window === 'undefined') return

    let channel: BroadcastChannel | null = null

    // 1. BroadcastChannel Listener
    if ('BroadcastChannel' in window) {
      channel = new BroadcastChannel('netra-realtime-bus')

      channel.onmessage = (event) => {
        if (event.data?.type === 'SYNC_STATE' && event.data?.payload) {
          const { dispatches, events, latestEvent } = event.data.payload
          syncFromExternal({ dispatches, events })

          if (latestEvent) {
            triggerRealtimeToast(latestEvent)
          }
        }
      }
    }

    // 2. Storage event fallback for cross-window sync
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'netra-realtime-sync' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          if (parsed.state) {
            syncFromExternal(parsed.state)
          }
        } catch {
          // Ignore JSON parse errors
        }
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => {
      if (channel) {
        channel.close()
      }
      window.removeEventListener('storage', handleStorage)
    }
  }, [syncFromExternal])

  const triggerRealtimeToast = (event: RealtimeEvent) => {
    if (event.type === 'PATROL_DISPATCHED') {
      toast.info(event.title, {
        description: event.message,
        duration: 5000
      })
    } else if (event.type === 'PATROL_STATUS_UPDATED') {
      toast.success(event.title, {
        description: event.message,
        duration: 4000
      })
    } else if (event.type === 'FIR_CREATED') {
      toast.warning(event.title, {
        description: event.message,
        duration: 4000
      })
    } else {
      toast(event.title, {
        description: event.message
      })
    }
  }

  return null
}
