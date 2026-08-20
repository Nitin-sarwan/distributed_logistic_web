import { useContext } from 'react'

import { AuthContext, type AuthContextValue } from '../context/AuthContext'

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>. See app/providers.')
  }

  return context
}
