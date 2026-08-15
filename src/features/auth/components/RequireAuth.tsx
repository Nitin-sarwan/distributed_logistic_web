import { useEffect, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { Loader } from '@/components/Loader'
import { ROUTES } from '@/constants'

import { useAuth } from '../hooks/useAuth'
import { useAuthModal } from '../hooks/useAuthModal'

/**
 * Route guard for pages that need a signed-in user.
 *
 * This is **navigation convenience, not security**. It decides what to render,
 * nothing more. Every protected endpoint is enforced by the backend, which
 * re-verifies the session on each request — so a user who defeats this guard
 * reaches a page whose data requests all return 401. Frontend authorization is
 * never trusted.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const { open } = useAuthModal()
  const location = useLocation()

  // Prompt instead of silently bouncing: someone who followed a link to
  // /profile wants /profile, so log them in and put them there.
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      open('login')
    }
  }, [isLoading, isAuthenticated, open])

  // The session is still unknown. Rendering the redirect now would throw a
  // signed-in user off their own page on every reload.
  if (isLoading) {
    return <Loader fullPage label="Checking your session…" />
  }

  if (!isAuthenticated) {
    // `state.from` lets a future post-login redirect return them here.
    return <Navigate to={ROUTES.home} replace state={{ from: location.pathname }} />
  }

  return <>{children}</>
}
