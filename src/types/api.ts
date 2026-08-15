/**
 * Shapes shared across features, mirroring the backend's HTTP contract.
 *
 * Feature-specific types live in `features/<name>/types.ts`. Only things more
 * than one feature needs belong here.
 */

/** A simple acknowledgement. FastAPI's convention for non-resource responses. */
export interface DetailResponse {
  detail: string
}

/** The user record, as returned by `UserResponse` in the User Service. */
export interface User {
  id: number
  name: string
  email: string
  /**
   * Always present and unique. Required at registration and NOT NULL in the
   * `users` table, so this is never null — a delivery platform needs a number
   * the driver can call.
   */
  phone: string
  /** ISO-8601 timestamp. */
  created_at: string
}

/** Status of an async operation, for components that render each state. */
export type RequestStatus = 'idle' | 'loading' | 'success' | 'error'
