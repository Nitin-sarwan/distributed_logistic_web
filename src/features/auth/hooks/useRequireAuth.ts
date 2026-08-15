import { useCallback } from 'react'

import { useAuth } from './useAuth'
import { useAuthModal } from './useAuthModal'

/**
 * Run an action only if signed in; otherwise prompt, then resume it.
 *
 * ```tsx
 * const requireAuth = useRequireAuth()
 * <Button onClick={() => requireAuth(() => bookDelivery())}>Book</Button>
 * ```
 *
 * This is the "continue previous action" flow: the user is never made to
 * re-navigate and re-enter what they had already done just because they had to
 * authenticate first.
 *
 * This is a convenience, not a security control. Authorization is enforced by
 * the backend on every request; anything gated here alone is not protected.
 */
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
