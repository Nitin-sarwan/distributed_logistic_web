import { useCallback, useMemo, useReducer, type ReactNode } from 'react'

import { useIsMounted, useSessionExpiry, useSessionProbe } from '@/hooks'

import * as authApi from '../api/authApi'
import type { LoginPayload, RegisterPayload } from '../types'
import { AuthContext, type AuthContextValue } from './AuthContext'
import { authReducer, initialAuthState } from './authReducer'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState)
  const isMounted = useIsMounted()

  useSessionProbe(authApi.getCurrentUser, (user) =>
    dispatch({ type: 'session-resolved', user }),
  )

  useSessionExpiry(
    'user',
    useCallback(() => dispatch({ type: 'signed-out' }), []),
  )

  const login = useCallback(
    async (payload: LoginPayload) => {
      const user = await authApi.login(payload)
      if (isMounted.current) dispatch({ type: 'authenticated', user })
      return user
    },
    [isMounted],
  )

  const signup = useCallback(
    async (payload: RegisterPayload) => {
      const user = await authApi.signup(payload)
      if (isMounted.current) dispatch({ type: 'authenticated', user })
      return user
    },
    [isMounted],
  )

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } finally {
      if (isMounted.current) dispatch({ type: 'signed-out' })
    }
  }, [isMounted])

  const logoutEverywhere = useCallback(async () => {
    try {
      return await authApi.logoutEverywhere()
    } finally {
      if (isMounted.current) dispatch({ type: 'signed-out' })
    }
  }, [isMounted])

  const refreshUser = useCallback(async () => {
    const user = await authApi.getProfile()
    if (isMounted.current) dispatch({ type: 'user-updated', user })
  }, [isMounted])

  const clearSession = useCallback(() => dispatch({ type: 'signed-out' }), [])

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
