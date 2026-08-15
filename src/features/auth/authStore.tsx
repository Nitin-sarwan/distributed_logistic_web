import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react'

import { onSessionExpired } from '@/services'
import type { User } from '@/types'

import * as authApi from './api/authApi'
import type { AuthState, LoginPayload, RegisterPayload } from './types'

/**
 * Authentication state for the application.
 *
 * Built on React context and a reducer rather than Redux/Zustand/etc. The state
 * is three fields and five transitions; a state-management dependency would be
 * more code to read, not less. If a future feature needs server-cache semantics
 * (orders, tracking), that is the point to reconsider — not now.
 *
 * The state is a *reflection* of the server's session, never the authority on
 * it. `isAuthenticated` is set because `GET /profile` returned 200, and cleared
 * because the server said 401 or logout succeeded. It is never inferred from
 * anything stored in the browser.
 */

type AuthAction =
  /** The startup probe finished. `user` is null when nobody is signed in. */
  | { type: 'session-resolved'; user: User | null }
  /** Login or signup succeeded. */
  | { type: 'authenticated'; user: User }
  /** Logout, or the server rejected our credential. */
  | { type: 'signed-out' }
  /** Profile data refreshed for an already-authenticated user. */
  | { type: 'user-updated'; user: User }

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  // Starts true: until the probe answers, "signed in" is genuinely unknown, and
  // rendering a protected route as though it were "signed out" would bounce a
  // logged-in user to the home page on every reload.
  isLoading: true,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'session-resolved':
      return {
        user: action.user,
        isAuthenticated: action.user !== null,
        isLoading: false,
      }

    case 'authenticated':
      return { user: action.user, isAuthenticated: true, isLoading: false }

    case 'signed-out':
      return { user: null, isAuthenticated: false, isLoading: false }

    case 'user-updated':
      // Ignore a stale profile response that lands after a sign-out.
      return state.isAuthenticated ? { ...state, user: action.user } : state

    default:
      return state
  }
}

export interface AuthContextValue extends AuthState {
  login: (payload: LoginPayload) => Promise<User>
  signup: (payload: RegisterPayload) => Promise<User>
  logout: () => Promise<void>
  logoutEverywhere: () => Promise<number>
  /** Re-read the profile from the server, e.g. after an edit. */
  refreshUser: () => Promise<void>
  /** Drop local auth state without calling the server. For post-password-change. */
  clearSession: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Guards against setting state after unmount, and against a slow probe
  // overwriting a login that completed while it was still in flight.
  const isMounted = useRef(true)
  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  /**
   * The startup probe: ask the server who, if anyone, is signed in.
   *
   * Runs exactly once on mount. This is the whole of "how does the frontend
   * know the user is logged in" — one request, 200 or 401.
   */
  useEffect(() => {
    let cancelled = false

    authApi
      .getCurrentUser()
      .then((user) => {
        if (!cancelled) dispatch({ type: 'session-resolved', user })
      })
      .catch(() => {
        // The probe failing for any other reason (gateway down, CORS, network)
        // is not evidence of a session. Treat it as signed out and let the app
        // render; the next real request will surface a specific error.
        if (!cancelled) dispatch({ type: 'session-resolved', user: null })
      })

    return () => {
      cancelled = true
    }
  }, [])

  /**
   * The server rejected our credential on some later request — expired,
   * revoked from another device, or ended by a password change elsewhere.
   * Reflect that immediately instead of leaving a signed-in shell that 401s.
   */
  useEffect(() => onSessionExpired(() => dispatch({ type: 'signed-out' })), [])

  const login = useCallback(async (payload: LoginPayload) => {
    const user = await authApi.login(payload)
    if (isMounted.current) dispatch({ type: 'authenticated', user })
    return user
  }, [])

  const signup = useCallback(async (payload: RegisterPayload) => {
    // The backend issues a session as part of registration, so this is a login
    // too — one consistent behaviour, no "now please sign in" step.
    const user = await authApi.signup(payload)
    if (isMounted.current) dispatch({ type: 'authenticated', user })
    return user
  }, [])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      // Sign out locally even if the request failed. The alternative — a UI
      // stuck in a signed-in state after the user asked to leave — is worse,
      // and authApi.logout has already dropped the local credential.
      if (isMounted.current) dispatch({ type: 'signed-out' })
    }
  }, [])

  const logoutEverywhere = useCallback(async () => {
    try {
      return await authApi.logoutEverywhere()
    } finally {
      if (isMounted.current) dispatch({ type: 'signed-out' })
    }
  }, [])

  const refreshUser = useCallback(async () => {
    const user = await authApi.getProfile()
    if (isMounted.current) dispatch({ type: 'user-updated', user })
  }, [])

  const clearSession = useCallback(() => {
    dispatch({ type: 'signed-out' })
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      signup,
      logout,
      logoutEverywhere,
      refreshUser,
      clearSession,
    }),
    [state, login, signup, logout, logoutEverywhere, refreshUser, clearSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
