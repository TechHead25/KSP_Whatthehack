// ============================================================
// NETRA AI — Axios API Client
// JWT interceptor + automatic token refresh
// ============================================================
import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '../stores/authStore'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'

export const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // Send httpOnly refresh cookie
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
})

// ── Request interceptor — attach Bearer token ─────────────────

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    config.headers['X-Request-ID'] = crypto.randomUUID()
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor — silent token refresh ───────────────

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: string) => void
  reject: (reason?: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token)
    else reject(error)
  })
  failedQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue this request until refresh is done
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return apiClient(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await axios.post(
          `${API_BASE}/auth/refresh`,
          {},
          { withCredentials: true }
        )

        const newToken: string = data.data.access_token
        useAuthStore.getState().setAccessToken(newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        processQueue(null, newToken)
        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        useAuthStore.getState().logout()
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
