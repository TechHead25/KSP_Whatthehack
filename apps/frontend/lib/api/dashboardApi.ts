// ============================================================
// NETRA AI — Dashboard API Layer
// Typed functions consuming existing BFF endpoints
// ============================================================
import { apiClient } from './client'

// ── Types ─────────────────────────────────────────────────────

export interface OverviewWidgetData {
  total_active_firs: number
  predicted_crime_trend: 'UP' | 'DOWN' | 'STABLE'
  high_risk_suspects: number
  patrol_coverage_percent: number
}

export interface ActivityItem {
  timestamp: string
  action: string
  entity_type: string
  entity_id: string
  description: string
}

export interface AlertWidget {
  unread_critical_alerts: number
  recent_alerts: Array<{
    message: string
    severity: string
    [key: string]: unknown
  }>
}

export interface DashboardWidgets {
  overview: OverviewWidgetData
  recent_activity: ActivityItem[]
  alerts: AlertWidget
  heatmap_url: string
  graph_summary_url: string
}

export interface OfficerDashboardResponse {
  officer_id: string
  officer_name: string
  widgets: DashboardWidgets
  last_refreshed: string
}

export interface AnalyticsDashboardResponse {
  active_firs: { count: number; trend: number; trend_direction: string }
  closed_this_month: { count: number; trend: number }
  high_risk_suspects: { count: number; trend: number }
  hotspots_active: { count: number }
  ai_insights_today: { count: number }
  crime_by_type: Array<{ type: string; count: number; percentage: number }>
  crime_trend_7d: Array<{ date: string; count: number }>
  top_crime_areas: Array<{ station: string; count: number }>
}

export interface NotificationHistoryItem {
  id: string
  officer_id: string
  alert_type: string
  channel: string
  status: string
  payload: { message: string; severity: string; location?: string }
  created_at: string
}

// ── API Functions ─────────────────────────────────────────────

export async function fetchOfficerDashboard(officerId: string): Promise<OfficerDashboardResponse | null> {
  try {
    if (officerId.includes('demo')) throw new Error('Demo Mode')
    const { data } = await apiClient.get(`/dashboard/officer/${officerId}`)
    return data.data
  } catch (error) {
    return null
  }
}

export async function fetchAnalyticsDashboard(): Promise<AnalyticsDashboardResponse | null> {
  try {
    const { data } = await apiClient.get('/analytics/dashboard')
    return data.data
  } catch (error) {
    return null
  }
}

export async function fetchAlertHistory(officerId: string): Promise<NotificationHistoryItem[] | null> {
  try {
    if (officerId.includes('demo')) throw new Error('Demo Mode')
    const { data } = await apiClient.get(`/alerts/history/${officerId}`)
    return data.data
  } catch (error) {
    return null
  }
}

export async function fetchSystemTelemetry() {
  try {
    const { data } = await apiClient.get('/admin/monitoring/telemetry')
    return data.data
  } catch (error) {
    return null
  }
}
