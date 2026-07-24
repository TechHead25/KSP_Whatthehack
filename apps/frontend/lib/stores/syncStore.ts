// ============================================================
// NETRA AI — Global Real-Time Synchronization & Dispatch Store
// Manages cross-session BroadcastChannel events & patrol dispatches
// ============================================================
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface PatrolDispatchItem {
  id: string
  unit: string
  area: string
  officerBadge: string
  officerName: string
  dispatchedBy: string
  shiftTime: string
  risk: 'Critical' | 'High' | 'Medium' | 'Low'
  status: 'DISPATCHED' | 'EN_ROUTE' | 'ARRIVED' | 'COMPLETED'
  lat: number
  lng: number
  waypoints: string[]
  notes?: string
  timestamp: string
}

export interface RealtimeEvent {
  id: string
  type: 'PATROL_DISPATCHED' | 'PATROL_STATUS_UPDATED' | 'FIR_CREATED' | 'ADMIN_UPDATED'
  title: string
  message: string
  timestamp: string
  senderBadge?: string
}

interface SyncStore {
  dispatches: PatrolDispatchItem[]
  events: RealtimeEvent[]
  
  // Actions
  dispatchPatrol: (item: Omit<PatrolDispatchItem, 'id' | 'timestamp'>) => void
  updatePatrolStatus: (dispatchId: string, status: PatrolDispatchItem['status']) => void
  addEvent: (event: Omit<RealtimeEvent, 'id' | 'timestamp'>) => void
  syncFromExternal: (state: { dispatches: PatrolDispatchItem[]; events: RealtimeEvent[] }) => void
}

const BROADCAST_CHANNEL_NAME = 'netra-realtime-bus'
let broadcastChannel: BroadcastChannel | null = null

if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME)
}

export const useSyncStore = create<SyncStore>()(
  persist(
    (set, get) => ({
      dispatches: [
        {
          id: 'DSP-01',
          unit: 'Hoysala 12',
          area: 'Indiranagar 100ft Road',
          officerBadge: 'INSP-BLR-0001',
          officerName: 'Inspector Rajesh Kumar',
          dispatchedBy: 'Commissioner Demo',
          shiftTime: '22:00 - 02:00',
          risk: 'High',
          status: 'DISPATCHED',
          lat: 12.9784,
          lng: 77.6408,
          waypoints: ['Indiranagar Metro', '100ft Road Junction', 'CMH Road'],
          timestamp: new Date().toISOString()
        },
        {
          id: 'DSP-02',
          unit: 'Cheetah 4',
          area: 'Koramangala 4th Block',
          officerBadge: 'DYSP-BLR-0001',
          officerName: 'DySP Priya Nair',
          dispatchedBy: 'Commissioner Demo',
          shiftTime: '01:00 - 05:00',
          risk: 'Critical',
          status: 'EN_ROUTE',
          lat: 12.9352,
          lng: 77.6245,
          waypoints: ['Sony Signal', 'Koramangala 4th Block Park', '80ft Road'],
          timestamp: new Date().toISOString()
        }
      ],
      events: [],

      dispatchPatrol: (itemData) => {
        const newItem: PatrolDispatchItem = {
          ...itemData,
          id: `DSP-${Date.now().toString().slice(-4)}`,
          timestamp: new Date().toISOString()
        }

        const newEvent: RealtimeEvent = {
          id: `EVT-${Date.now()}`,
          type: 'PATROL_DISPATCHED',
          title: `🚨 Patrol Dispatched: ${newItem.unit}`,
          message: `${newItem.dispatchedBy} assigned ${newItem.unit} (${newItem.officerName}) to ${newItem.area}`,
          timestamp: new Date().toISOString(),
          senderBadge: newItem.dispatchedBy
        }

        const updatedDispatches = [newItem, ...get().dispatches]
        const updatedEvents = [newEvent, ...get().events].slice(0, 30)

        set({ dispatches: updatedDispatches, events: updatedEvents })

        // Broadcast to all other sessions / windows
        if (broadcastChannel) {
          broadcastChannel.postMessage({
            type: 'SYNC_STATE',
            payload: { dispatches: updatedDispatches, events: updatedEvents, latestEvent: newEvent }
          })
        }
      },

      updatePatrolStatus: (dispatchId, status) => {
        const target = get().dispatches.find(d => d.id === dispatchId)
        const updatedDispatches = get().dispatches.map(d => 
          d.id === dispatchId ? { ...d, status } : d
        )

        const newEvent: RealtimeEvent = {
          id: `EVT-${Date.now()}`,
          type: 'PATROL_STATUS_UPDATED',
          title: `PATROL UPDATE: ${target?.unit || 'Unit'}`,
          message: `${target?.officerName || 'Officer'} marked patrol status as ${status} in ${target?.area}`,
          timestamp: new Date().toISOString(),
        }

        const updatedEvents = [newEvent, ...get().events].slice(0, 30)
        set({ dispatches: updatedDispatches, events: updatedEvents })

        if (broadcastChannel) {
          broadcastChannel.postMessage({
            type: 'SYNC_STATE',
            payload: { dispatches: updatedDispatches, events: updatedEvents, latestEvent: newEvent }
          })
        }
      },

      addEvent: (eventData) => {
        const newEvent: RealtimeEvent = {
          ...eventData,
          id: `EVT-${Date.now()}`,
          timestamp: new Date().toISOString()
        }

        const updatedEvents = [newEvent, ...get().events].slice(0, 30)
        set({ events: updatedEvents })

        if (broadcastChannel) {
          broadcastChannel.postMessage({
            type: 'SYNC_STATE',
            payload: { dispatches: get().dispatches, events: updatedEvents, latestEvent: newEvent }
          })
        }
      },

      syncFromExternal: (state) => {
        set({ dispatches: state.dispatches, events: state.events })
      }
    }),
    {
      name: 'netra-realtime-sync',
      storage: createJSONStorage(() => localStorage)
    }
  )
)
