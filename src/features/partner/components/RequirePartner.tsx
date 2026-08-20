import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { Loader } from '@/components/Loader'
import { ROUTES } from '@/constants'

import { usePartner } from '../hooks/usePartner'

export function RequirePartner({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = usePartner()
  const location = useLocation()

  if (isLoading) {
    return <Loader fullPage label="Checking your session…" />
  }

  if (!isAuthenticated) {
    return (
      <Navigate to={ROUTES.partnerLogin} replace state={{ from: location.pathname }} />
    )
  }

  return <>{children}</>
}
