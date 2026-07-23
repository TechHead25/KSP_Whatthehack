// ============================================================
// NETRA AI — Zustand Auth Store
// Manages authentication state per SECURITY.md §3
// ============================================================
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AuthenticatedOfficer } from '@netra/types'

interface AuthStore {
  // State
  officer: AuthenticatedOfficer | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  isMFAPending: boolean
  tempToken: string | null
  error: string | null

  // Actions
  setOfficer: (officer: AuthenticatedOfficer, accessToken: string) => void
  setMFAPending: (tempToken: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setAccessToken: (token: string) => void
  logout: () => void
}

const clearPersistedAuth = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.removeItem('netra-auth')
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // ── Initial state ──────────────────────────────────
      officer: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      isMFAPending: false,
      tempToken: null,
      error: null,

      // ── Actions ────────────────────────────────────────
      setOfficer: (officer, accessToken) =>
        set({
          officer,
          accessToken,
          isAuthenticated: true,
          isMFAPending: false,
          tempToken: null,
          error: null,
        }),

      setMFAPending: (tempToken) =>
        set({
          isMFAPending: true,
          tempToken,
          isAuthenticated: false,
          error: null,
        }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      setAccessToken: (accessToken) => set({ accessToken }),

      logout: () => {
        clearPersistedAuth()
        set({
          officer: null,
          accessToken: null,
          isAuthenticated: false,
          isMFAPending: false,
          tempToken: null,
          error: null,
        })
      },
    }),
    {
      name: 'netra-auth',
      // Only persist non-sensitive state — token stored in httpOnly cookie
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        officer: state.officer,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
      }),
    }
  )
)

// ── Selectors ─────────────────────────────────────────────────

export const selectOfficer = (s: AuthStore) => s.officer
export const selectIsAuthenticated = (s: AuthStore) => s.isAuthenticated
export const selectAccessToken = (s: AuthStore) => s.accessToken
export const selectRole = (s: AuthStore) => s.officer?.role ?? null
export const selectPermissions = (s: AuthStore) => s.officer?.permissions ?? []
