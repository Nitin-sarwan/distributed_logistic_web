/**
 * How the session credential reaches the gateway.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * `cookie` is the default and what the backend now does. Login and register set
 * an HttpOnly session cookie, so the frontend stores *nothing*: the browser
 * attaches it to every request because `withCredentials` is on, and JavaScript
 * cannot read it — an injected script has no way to exfiltrate the credential,
 * and it survives a page reload.
 *
 * `bearer` remains supported because `extract_token` still accepts
 * `Authorization: Bearer` and `X-Token`, which is what non-browser clients use.
 * In that mode the token is held in a module-scoped variable — memory only,
 * deliberately NOT localStorage or sessionStorage:
 *
 *   - localStorage is readable by any script on the origin, which turns one XSS
 *     into a permanent account compromise.
 *   - Both survive a tab close, so the credential outlives the session it
 *     represents.
 *
 * The honest cost of memory-only storage is that a reload signs the user out.
 * That is why `cookie` is the default: HttpOnly gives the same protection from
 * scripts *and* persists properly.
 *
 * Nothing outside this file knows which mode is active — switching is one env
 * variable, with no feature, hook, or component change.
 *
 * A cookie is attached by the browser automatically, so it is the one form
 * exposed to CSRF. The backend sets `SameSite=Lax`, which withholds it from
 * cross-site POSTs; the gateway's explicit CORS origin list stops another site
 * reading any response it does manage to trigger.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type AuthTransport = 'cookie' | 'bearer'

export const AUTH_TRANSPORT: AuthTransport =
  import.meta.env.VITE_AUTH_TRANSPORT === 'bearer' ? 'bearer' : 'cookie'

/** In-memory only. Never persisted, never serialised, never logged. */
let sessionToken: string | null = null

/**
 * Record the credential returned by login/register.
 *
 * A no-op under `cookie`, where the browser already holds the cookie and the
 * response body carries no token to keep.
 */
export function setSessionToken(token: string | null): void {
  if (AUTH_TRANSPORT === 'cookie') return
  sessionToken = token
}

/** Drop the in-memory credential. Called after logout, and on any 401. */
export function clearSessionToken(): void {
  sessionToken = null
}

/**
 * Headers carrying the session credential, if this transport uses any.
 *
 * Under `cookie` this is always empty — the credential rides on the Cookie
 * header, which the browser manages and JavaScript never touches.
 */
export function authHeaders(): Record<string, string> {
  if (AUTH_TRANSPORT === 'cookie' || !sessionToken) return {}
  return { Authorization: `Bearer ${sessionToken}` }
}

/**
 * Whether a credential *might* exist, used only to decide if the startup
 * session probe is worth making.
 *
 * Under `cookie` this is always true: the cookie is invisible to JavaScript, so
 * the only way to know is to ask the server. That is the whole point of the
 * `GET /profile` bootstrap — the server is the authority on who is signed in,
 * not any client-side flag.
 */
export function mayHaveSession(): boolean {
  return AUTH_TRANSPORT === 'cookie' || sessionToken !== null
}
