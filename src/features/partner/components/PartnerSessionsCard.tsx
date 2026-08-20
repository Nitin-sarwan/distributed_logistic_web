import { useState } from 'react'

import { Button } from '@/components/Button'
import { Card } from '@/components/Card'

import { usePartner } from '../hooks/usePartner'

export function PartnerSessionsCard() {
  const { logoutEverywhere } = usePartner()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const signOutEverywhere = async () => {
    setIsSigningOut(true)
    try {
      await logoutEverywhere()
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <Card
      title="Sessions"
      description="Signed in on a phone you no longer have? End every session."
    >
      <p className="vehicle__note">
        This signs you out on every device, including this one, and stops any
        outstanding session from working. Use it if you think someone else has your
        password.
      </p>

      <div className="vehicle-form__actions">
        <Button
          variant="danger"
          onClick={() => void signOutEverywhere()}
          isLoading={isSigningOut}
          loadingText="Signing out…"
        >
          Sign out everywhere
        </Button>
      </div>
    </Card>
  )
}
