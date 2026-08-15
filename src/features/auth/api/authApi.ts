import { API_ROUTES } from '@/constants'
import {
  ApiError,
  get,
  getAllowingUnauthenticated,
  post,
  setSessionToken,
  clearSessionToken,
  mayHaveSession,
} from '@/services'
import type { DetailResponse, User } from '@/types'

import type {
  AuthResponse,
  ChangePasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
} from '../types'

/**
 * Every User Service call the auth feature makes.
 *
 * Components and pages never call `apiClient` directly — they go through these
 * functions, which own the paths, the payload shapes, and what happens to the
 * session credential. That is what keeps a route rename from touching a dozen
 * components, and keeps credential handling in one auditable place.
 */

/**
 * Hand the session credential to the transport and return just the user.
 *
 * The response also contains `refresh_token`, which is deliberately **dropped**.
 * Using it would mean persisting a 30-day credential somewhere the browser can
 * reach across reloads — exactly the storage this app refuses to do. A session
 * that ends when the tab closes is the intended behaviour, not an omission.
 */
function adoptSession(response: AuthResponse): User {
  setSessionToken(response.access_token)
  return response.user
}

/**
 * Create an account.
 *
 * The backend registers *and* issues a session in one call, so the user is
 * signed in immediately — no second login step. This is the chosen, consistent
 * behaviour for the whole app.
 *
 * `payload.password` exists only for the duration of this call. It is never
 * stored, cached, or written to state.
 */
export async function signup(payload: RegisterPayload): Promise<User> {
  return adoptSession(await post<AuthResponse>(API_ROUTES.auth.register, payload))
}

/** Exchange credentials for a session. */
export async function login(payload: LoginPayload): Promise<User> {
  return adoptSession(await post<AuthResponse>(API_ROUTES.auth.login, payload))
}

/**
 * The startup session probe — the `/auth/me` of the spec.
 *
 * This is the *only* way the app decides whether someone is signed in. It never
 * inspects storage for a token, because the client's opinion is not evidence:
 * a session can be revoked from another device, expire, or be ended by a
 * password change, and only the server knows.
 *
 * Returns `null` for 401, which is a normal answer meaning "nobody is signed
 * in" — not an error worth surfacing.
 */
export async function getCurrentUser(): Promise<User | null> {
  // Under the bearer transport there is no credential to send after a reload,
  // so the request would be a guaranteed 401. Skip it rather than making the
  // whole app wait on a round trip whose answer is already known.
  if (!mayHaveSession()) return null

  try {
    return await getAllowingUnauthenticated<User>(API_ROUTES.auth.me)
  } catch (error) {
    if (error instanceof ApiError && error.isUnauthenticated) return null
    throw error
  }
}

/** The signed-in user's profile. Same endpoint as the probe, but 401 throws. */
export function getProfile(): Promise<User> {
  return get<User>(API_ROUTES.profile.me)
}

/**
 * End the session.
 *
 * The server-side revocation is the part that matters: it flips `is_active` on
 * the Mongo session document, so the credential stops working immediately for
 * everyone holding it. Clearing local state alone would leave a live session
 * behind — which is precisely the failure mode token-in-localStorage designs
 * have.
 *
 * The local credential is cleared even if the request fails, so a network error
 * cannot strand the UI in a signed-in state it cannot leave.
 */
export async function logout(): Promise<void> {
  try {
    await post<DetailResponse>(API_ROUTES.auth.logout)
  } finally {
    clearSessionToken()
  }
}

/** Revoke every session on every device, and rotate the user's token secret. */
export async function logoutEverywhere(): Promise<number> {
  try {
    const response = await post<DetailResponse & { sessions_revoked: number }>(
      API_ROUTES.auth.logoutAll,
    )
    return response.sessions_revoked
  } finally {
    clearSessionToken()
  }
}

/**
 * Change the password of a signed-in user.
 *
 * The backend revokes every session on success, so the caller must treat the
 * user as signed out afterwards — the current credential is already dead.
 */
export async function changePassword(payload: ChangePasswordPayload): Promise<string> {
  const response = await post<DetailResponse>(API_ROUTES.auth.changePassword, payload)
  clearSessionToken()
  return response.detail
}

/**
 * Request a password reset link.
 *
 * Always resolves, whether or not the address is registered — the backend
 * answers identically on purpose, so this endpoint cannot be used to discover
 * which emails have accounts. The UI must not imply otherwise.
 *
 * `reset_token` comes back only when the backend runs with
 * `PASSWORD_RESET_EXPOSE_TOKEN=true`, a local-development setting.
 */
export async function forgotPassword(email: string): Promise<{ resetToken?: string }> {
  const response = await post<DetailResponse & { reset_token?: string }>(
    API_ROUTES.auth.forgotPassword,
    { email },
  )
  return response.reset_token ? { resetToken: response.reset_token } : {}
}

/** Set a new password using a reset token. Every session is revoked. */
export async function resetPassword(payload: ResetPasswordPayload): Promise<string> {
  const response = await post<DetailResponse>(API_ROUTES.auth.resetPassword, payload)
  clearSessionToken()
  return response.detail
}
