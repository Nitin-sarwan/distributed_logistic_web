import { useContext } from 'react'

import { AuthModalContext, type AuthModalContextValue } from '../authModalStore'

export function useAuthModal(): AuthModalContextValue {
  const context = useContext(AuthModalContext)

  if (!context) {
    throw new Error('useAuthModal must be used inside <AuthModalProvider>.')
  }

  return context
}
