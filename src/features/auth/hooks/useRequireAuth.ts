import { useCallback } from 'react'

import { useAuth } from './useAuth'
import { useAuthModal } from './useAuthModal'

export function useRequireAuth() {
  const { isAuthenticated } = useAuth()
  const { open } = useAuthModal()

  return useCallback(
    (action: () => void, view: 'login' | 'signup' = 'login') => {
      if (isAuthenticated) {
        action()
        return
      }
      open(view, action)
    },
    [isAuthenticated, open],
  )
}
