import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios'

import { authHeaders, clearSessionToken } from './sessionTransport'
import { toApiError } from './httpError'

/**
 * The one HTTP client for the whole application.
 *
 * Exactly one instance exists. Features import the request helpers below rather
 * than calling axios themselves, which is what keeps credentials, error
 * normalisation, and the base URL from drifting apart across the codebase.
 *
 * `baseURL` is the API Gateway and nothing else. The frontend never learns that
 * userServices is on :8001 or that an order service will be on :8002 — it asks
 * the gateway for `/api/users/...` and the gateway decides who answers.
 */

const baseURL = import.meta.env.VITE_API_URL

if (!baseURL) {
  // Loud and early: a missing gateway URL makes every request fail with a
  // confusing relative-path 404 much later.
  throw new Error(
    'VITE_API_URL is not set. Copy .env.example to .env and point it at the API Gateway.',
  )
}

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 20_000,
  headers: { 'Content-Type': 'application/json' },
  /**
   * Send credentials cross-origin.
   *
   * The gateway answers with `Access-Control-Allow-Credentials: true` and an
   * explicit origin, so this is what allows the session cookie to ride along
   * once the backend issues one. It is on unconditionally, in both transport
   * modes, so switching to cookies needs no change here.
   */
  withCredentials: true,
})

/**
 * Attach the session credential.
 *
 * Under the bearer transport this adds `Authorization: Bearer <token>` from the
 * in-memory holder. Under the cookie transport it adds nothing, because the
 * browser is already attaching the HttpOnly cookie.
 *
 * Doing it in an interceptor rather than at each call site means no feature can
 * forget it, and no feature can accidentally leak the token by logging its own
 * request config.
 */
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const headers = authHeaders()
  for (const [key, value] of Object.entries(headers)) {
    config.headers.set(key, value)
  }
  return config
})

/**
 * A 401 means the server considers the session over — expired, revoked from
 * another device, or logged out everywhere. Drop the local credential so the
 * app stops sending a token the backend has already rejected.
 *
 * Auth state itself is *not* reset here. That belongs to the auth store, which
 * subscribes below; a service module reaching into React state would invert the
 * dependency and make this file untestable in isolation.
 */
type SessionExpiredListener = () => void
const sessionExpiredListeners = new Set<SessionExpiredListener>()

/** Subscribe to server-side session loss. Returns an unsubscribe function. */
export function onSessionExpired(listener: SessionExpiredListener): () => void {
  sessionExpiredListeners.add(listener)
  return () => sessionExpiredListeners.delete(listener)
}

/**
 * Requests that are *expected* to 401 as a normal outcome, and so must not be
 * treated as a session ending. The startup probe is the main one: a 401 there
 * means "nobody is signed in", which is an answer, not an expiry.
 */
const SILENT_401 = Symbol('silent401')

interface RequestOptions extends AxiosRequestConfig {
  /** Suppress the session-expired broadcast for an expected 401. */
  [SILENT_401]?: boolean
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const apiError = toApiError(error)

    if (apiError.isUnauthenticated) {
      const config = axios.isAxiosError(error)
        ? (error.config as RequestOptions | undefined)
        : undefined

      clearSessionToken()

      if (!config?.[SILENT_401]) {
        sessionExpiredListeners.forEach((listener) => listener())
      }
    }

    // Reject with the normalised error so every caller handles one type and
    // always has a message fit to show a person.
    return Promise.reject(apiError)
  },
)

/**
 * Thin typed wrappers.
 *
 * They exist so feature API modules read as `get<User>(path)` and receive data
 * directly, instead of repeating `.then(r => r.data)` and re-deriving types.
 */

export function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return apiClient.get<T>(url, config).then((response) => response.data)
}

export function post<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  return apiClient.post<T>(url, body, config).then((response) => response.data)
}

export function put<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  return apiClient.put<T>(url, body, config).then((response) => response.data)
}

export function patch<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  return apiClient.patch<T>(url, body, config).then((response) => response.data)
}

export function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return apiClient.delete<T>(url, config).then((response) => response.data)
}

/**
 * A GET whose 401 is an expected answer rather than a session ending.
 * Used by the startup session probe.
 */
export function getAllowingUnauthenticated<T>(url: string): Promise<T> {
  return get<T>(url, { [SILENT_401]: true } as RequestOptions)
}
