import type { User } from '@/types'

/** Credentials for `POST /api/users/login`. */
export interface LoginPayload {
  email: string
  password: string
}

/**
 * Registration body for `POST /api/users/register`.
 *
 * Every field is required: `RegisterUser` in the backend declares `phone: str`
 * with no default, and the column is NOT NULL, so omitting it is a 422.
 */
export interface RegisterPayload {
  name: string
  email: string
  phone: string
  password: string
}

/**
 * What the backend returns from login and register.
 *
 * `access_token` is an opaque, AES-encrypted blob backed by a Mongo session
 * record — not a JWT. It carries no readable claims, which is why `expires_at`
 * is sent separately, and it can be revoked server-side instantly.
 *
 * The token is handed to `sessionTransport` and held in memory. Nothing here is
 * ever written to localStorage or sessionStorage, and the password that
 * produced it is discarded the moment the request is sent.
 */
export interface AuthResponse {
  user: User
  access_token: string
  refresh_token: string
  token_type: string
  expires_at: string
  refresh_expires_at: string
  device_session: string
  device_id: string
}

export interface ChangePasswordPayload {
  current_password: string
  new_password: string
}

export interface ResetPasswordPayload {
  token: string
  new_password: string
}

/** Auth state, as consumed by the whole app. */
export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  /**
   * True only during the startup session probe.
   *
   * Routes must wait on this rather than treating "no user yet" as "signed
   * out", or a protected page would flash a redirect on every reload.
   */
  isLoading: boolean
}

/** Which form the auth modal is showing. */
export type AuthModalView = 'login' | 'signup' | 'forgot-password'
