// ============================================================
// NETRA AI — Dashboard React Query Hooks
// Caching, auto-refetch, error states
// ============================================================
import { useQuery } from '@tanstack/react-query'
import {
  fetchOfficerDashboard,
  fetchAnalyticsDashboard,
  fetchAlertHistory,
  fetchSystemTelemetry,
} from '../api/dashboardApi'
import { useAuthStore } from '../stores/authStore'

export function useOfficerDashboard() {
  const officer = useAuthStore((s) => s.officer)
  return useQuery({
    queryKey: ['dashboard', 'officer', officer?.id],
    queryFn: () => fetchOfficerDashboard(officer!.id),
    enabled: !!officer?.id,
    refetchInterval: 60_000,
    staleTime: 30_000,
  })
}

export function useAnalyticsDashboard() {
  return useQuery({
    queryKey: ['dashboard', 'analytics'],
    queryFn: fetchAnalyticsDashboard,
    refetchInterval: 120_000,
    staleTime: 60_000,
  })
}

export function useAlertHistory() {
  const officer = useAuthStore((s) => s.officer)
  return useQuery({
    queryKey: ['alerts', 'history', officer?.id],
    queryFn: () => fetchAlertHistory(officer!.id),
    enabled: !!officer?.id,
    refetchInterval: 30_000,
    staleTime: 15_000,
  })
}

export function useSystemTelemetry() {
  return useQuery({
    queryKey: ['admin', 'telemetry'],
    queryFn: fetchSystemTelemetry,
    refetchInterval: 60_000,
    staleTime: 30_000,
  })
}
