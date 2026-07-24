// ============================================================
// NETRA AI — Auth Types
// Source of truth: MASTER_PRD.md F-001, SECURITY.md §4
// DO NOT modify without explicit user instruction
// ============================================================

/** All roles defined in MASTER_PRD.md F-001 */
export type Role =
  | 'SUPER_ADMIN'
  | 'STATE_ADMIN'
  | 'DISTRICT_ADMIN'
  | 'COMMISSIONER'
  | 'DYSP'
  | 'INVESTIGATION_OFFICER'
  | 'POLICE_OFFICER'
  | 'READ_ONLY_OFFICER'
  | 'AUDITOR'

/** All granular permissions per SECURITY.md §4.2 */
export type Permission =
  | 'READ_ALL_FIRS'
  | 'READ_DISTRICT_FIRS'
  | 'READ_STATION_FIRS'
  | 'WRITE_FIRS'
  | 'READ_ALL_SUSPECTS'
  | 'READ_DISTRICT_SUSPECTS'
  | 'READ_STATION_SUSPECTS'
  | 'WRITE_SUSPECTS'
  | 'VIEW_CRIMINAL_NETWORK'
  | 'VIEW_HEATMAP'
  | 'VIEW_ANALYTICS'
  | 'GENERATE_REPORTS'
  | 'USE_AI_ASSISTANT'
  | 'MANAGE_OFFICERS'
  | 'VIEW_AUDIT_LOGS'
  | 'MANAGE_ALERTS'
  | 'VIEW_EVIDENCE'
  | 'MANAGE_PATROL'

/** Jurisdiction scope — drives data filtering on every query */
export type JurisdictionScope = 'NATIONAL' | 'DISTRICT' | 'STATION'

/** JWT payload claims — mirrors backend token generation */
export interface JWTClaims {
  sub: string          // officer UUID
  role: Role
  station_id: string
  district_id: string
  permissions: Permission[]
  iat: number
  exp: number
  jti: string          // JWT ID for revocation
}

/** Auth token pair returned from login / refresh */
export interface AuthTokens {
  access_token: string
  refresh_token: string
  token_type: 'Bearer'
  expires_in: number   // seconds
}

/** Login request body */
export interface LoginRequest {
  badge_number: string
  password: string
  device_fingerprint?: string
}

/** MFA verification request */
export interface MFAVerifyRequest {
  otp: string
  temp_token: string
}

/** Login response — returned from POST /auth/login */
export interface LoginResponse {
  tokens: AuthTokens
  officer: AuthenticatedOfficer
  mfa_required: boolean
  temp_token?: string  // present only when mfa_required = true
}

/** Minimal officer object embedded in JWT and session */
export interface AuthenticatedOfficer {
  id: string
  name: string
  badge_number: string
  email: string
  role: Role
  rank: string
  permissions: Permission[]
  jurisdiction_scope: JurisdictionScope
  station: {
    id: string
    name: string
    code: string
  }
  district: {
    id: string
    name: string
    code: string
  }
  photo_url?: string
  mfa_enabled: boolean
  last_login?: string
}

/** Auth store state shape */
export interface AuthState {
  officer: AuthenticatedOfficer | null
  isAuthenticated: boolean
  isLoading: boolean
  isMFAPending: boolean
  tempToken: string | null
  error: string | null
}
