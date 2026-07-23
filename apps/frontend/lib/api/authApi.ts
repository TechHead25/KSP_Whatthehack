// ============================================================
// NETRA AI — Auth API Functions
// Wraps all /auth/* endpoints from API_SPEC.md §3
// ============================================================
import type { LoginRequest, MFAVerifyRequest, AuthenticatedOfficer } from '@netra/types'
import apiClient from './client'

export interface LoginApiResponse {
  mfa_required: boolean
  temp_token?: string
  access_token?: string
  token_type?: string
  expires_in?: number
  officer?: AuthenticatedOfficer
}

export const authApi = {
  /** POST /auth/login */
  async login(body: LoginRequest): Promise<LoginApiResponse> {
    const { data } = await apiClient.post<{ success: true; data: LoginApiResponse }>(
      '/auth/login',
      body
    )
    return data.data
  },

  /** POST /auth/mfa/verify */
  async verifyMFA(body: MFAVerifyRequest): Promise<LoginApiResponse> {
    const { data } = await apiClient.post<{ success: true; data: LoginApiResponse }>(
      '/auth/mfa/verify',
      body
    )
    return data.data
  },

  /** POST /auth/refresh — uses httpOnly cookie automatically */
  async refresh(): Promise<{ access_token: string; expires_in: number }> {
    const { data } = await apiClient.post('/auth/refresh')
    return data.data
  },

  /** POST /auth/logout */
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },

  /** GET /auth/me */
  async getMe(): Promise<{ claims: Record<string, unknown> }> {
    const { data } = await apiClient.get('/auth/me')
    return data.data
  },
}
