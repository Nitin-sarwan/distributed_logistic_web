import { Navigate } from 'react-router-dom'

import { Loader } from '@/components/Loader'
import { ROUTES } from '@/constants'

import { PartnerSignupForm } from '../components/PartnerSignupForm'
import { usePartner } from '../hooks/usePartner'
import { PartnerAuthShell } from './PartnerAuthShell'

export function PartnerSignup() {
  const { isAuthenticated, isLoading } = usePartner()

  if (isLoading) return <Loader fullPage label="Checking your session…" />
  if (isAuthenticated) return <Navigate to={ROUTES.partner} replace />

  return (
    <PartnerAuthShell
      title="Become a partner"
      subtitle="Drive with LogisticPartner. Set up your account in a minute."
    >
      <PartnerSignupForm />
    </PartnerAuthShell>
  )
}
