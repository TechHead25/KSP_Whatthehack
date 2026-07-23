import { apiClient } from './client'

export interface FIR {
  id: string
  fir_number: string
  station_id: string
  district_id: string
  date_filed: string
  date_incident: string
  crime_type: string
  crime_subtype?: string
  ipc_sections?: string[]
  status: 'OPEN' | 'INVESTIGATING' | 'CHARGE_SHEETED' | 'CLOSED' | 'STAYED'
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL'
  description: string
  location_text?: string
  latitude?: number
  longitude?: number
  victim_count: number
  accused_count: number
  property_value?: number
  reporting_officer_id?: string
  investigating_officer_id?: string
  risk_score?: number
  created_at: string
  updated_at: string
}

export interface FIRCreatePayload {
  fir_number: string
  station_id: string
  district_id: string
  date_filed: string
  date_incident: string
  crime_type: string
  status: string
  priority: string
  description: string
}

// ============================================================
// API Functions
// ============================================================

export async function fetchFIRs(params?: Record<string, string | number | boolean | undefined>): Promise<FIR[]> {
  const { data } = await apiClient.get('/firs', { params })
  return data.data
}

export async function fetchFIR(id: string): Promise<FIR> {
  const { data } = await apiClient.get(`/firs/${id}`)
  return data.data
}

export async function createFIR(payload: FIRCreatePayload): Promise<FIR> {
  const { data } = await apiClient.post('/firs', payload)
  return data.data
}
