// ============================================================
// NETRA AI — API Response Types
// ============================================================

/** Standard success response envelope — per API_SPEC.md §2 */
export interface ApiResponse<T = unknown> {
  success: true
  data: T
  meta?: PaginationMeta
  timestamp: string
}

/** Standard error response envelope */
export interface ApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
  timestamp: string
}

/** Pagination metadata */
export interface PaginationMeta {
  page: number
  per_page: number
  total: number
  total_pages: number
}

/** Paginated list wrapper */
export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

/** API error codes from API_SPEC.md §13 */
export type ApiErrorCode =
  | 'AUTH_INVALID_CREDENTIALS'
  | 'AUTH_TOKEN_EXPIRED'
  | 'AUTH_MFA_REQUIRED'
  | 'AUTH_INSUFFICIENT_PERMISSIONS'
  | 'AUTH_JURISDICTION_VIOLATION'
  | 'RESOURCE_NOT_FOUND'
  | 'RATE_LIMIT_EXCEEDED'
  | 'AI_SERVICE_UNAVAILABLE'
  | 'GRAPH_QUERY_TIMEOUT'
  | 'VALIDATION_ERROR'
  | 'INTERNAL_SERVER_ERROR'
