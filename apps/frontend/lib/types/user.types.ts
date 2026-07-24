export interface Officer {
  id: string
  badge_number: string
  name: string
  email: string
  phone?: string
  role: string
  rank: string
  station_id: string
  district_id: string
  is_active: boolean
  mfa_enabled: boolean
  last_login?: string
  created_at: string
}
