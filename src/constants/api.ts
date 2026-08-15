/**
 * Every backend path the frontend knows.
 *
 * These are *gateway* paths. The gateway routes them onward by prefix
 * (`/api/users` -> userServices) and the frontend is deliberately unaware of
 * which service answers, or on which port. When order/payment/dispatch land,
 * they get their own block here and nothing else changes.
 *
 * Keeping them in one place is what makes a backend rename a one-line edit
 * rather than a grep across the codebase.
 */

/** Prefix owned by the User Service, as registered in the gateway's SERVICE_ROUTES. */
const USERS = '/api/users'

export const API_ROUTES = {
  auth: {
    /** POST — create an account. Returns a session; the user is logged in immediately. */
    register: `${USERS}/register`,
    /** POST — exchange credentials for a session. */
    login: `${USERS}/login`,
    /**
     * GET — the current session's user. This is the `/auth/me` of the spec:
     * the endpoint whose 200/401 answers "is anyone signed in?".
     */
    me: `${USERS}/profile`,
    /** POST — revoke the current session server-side. */
    logout: `${USERS}/logout`,
    /** POST — revoke every session on every device. */
    logoutAll: `${USERS}/logout-all`,
    /** POST — mint a new session token from a refresh token. */
    refresh: `${USERS}/refresh`,
    /** POST — change password for a signed-in user. Ends every session. */
    changePassword: `${USERS}/change-password`,
    /** POST — request a reset link. Always succeeds, account or not. */
    forgotPassword: `${USERS}/forgot-password`,
    /** POST — set a new password using a reset token. */
    resetPassword: `${USERS}/reset-password`,
  },

  profile: {
    /** GET — the signed-in user's record. */
    me: `${USERS}/profile`,
    /**
     * Saved addresses.
     *
     * The `address` table and its model exist in userServices, but no routes
     * are wired to them yet (USER_SERVICE.md, "Not implemented"). These are the
     * conventional REST paths for that table; see README.md for the exact
     * contract the backend needs to expose. Until it does, the addresses UI
     * detects the 404 and shows an explicit "not available yet" state instead
     * of a misleading error.
     */
    addresses: `${USERS}/addresses`,
    address: (id: number | string) => `${USERS}/addresses/${id}`,
  },

  /** Gateway health, including every downstream service it can reach. */
  health: '/health',
} as const
