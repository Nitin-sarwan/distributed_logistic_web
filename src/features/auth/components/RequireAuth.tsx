import { useEffect, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { Loader } from '@/components/Loader'
import { ROUTES } from '@/constants'

import { useAuth } from '../hooks/useAuth'
import { useAuthModal } from '../hooks/useAuthModal'

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const { open } = useAuthModal()
  const location = useLocation()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      open('login')
    }
  }, [isLoading, isAuthenticated, open])

  if (isLoading) {
    return <Loader fullPage label="Checking your session…" />
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.home} replace state={{ from: location.pathname }} />
  }

  return <>{children}</>
}
