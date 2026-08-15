import { useContext } from 'react'

import { AuthContext, type AuthContextValue } from '../authStore'

/**
 * Read and act on the current session.
 *
 * ```tsx
 * const { user, isAuthenticated, isLoading, logout } = useAuth()
 * ```
 *
 * Throwing on a missing provider turns a silent "everything is logged out"
 * bug — the failure mode of returning a default — into an immediate, obvious
 * error naming the cause.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>. See app/providers.')
  }

  return context
}
