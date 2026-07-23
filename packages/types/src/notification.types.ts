// ============================================================
// NETRA AI — Notification Types
// ============================================================

export type NotificationSeverity = 'info' | 'warning' | 'high' | 'critical'

export type NotificationType =
  | 'HOTSPOT_ALERT'
  | 'SUSPECT_ALERT'
  | 'NETWORK_ANOMALY'
  | 'GANG_ACTIVITY'
  | 'SYSTEM'
  | 'EARLY_WARNING'

export interface Notification {
  id: string
  type: NotificationType
  severity: NotificationSeverity
  title: string
  description: string
  isRead: boolean
  createdAt: string
  expiresAt?: string
  relatedFirId?: string
  relatedSuspectId?: string
  districtId?: string
  stationId?: string
  actionUrl?: string
}

/** User type placeholder — to be expanded in later sprints */
export interface OfficerProfile {
  id: string
  name: string
  badge_number: string
  rank: string
  role: string
  station_name: string
  district_name: string
  photo_url?: string
}
