import { useState } from 'react'
import { Link } from 'react-router-dom'

import { Alert } from '@/components/Alert'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { ROUTES } from '@/constants'
import { ApiError } from '@/services'
import { ChangePasswordForm, useAuth } from '@/features/auth'

import '../Profile/Profile.css'
import '../Addresses/Addresses.css'

/** Password change and the "sign out everywhere" control. */
export function Security() {
  const { logoutEverywhere } = useAuth()
  const [isRevoking, setIsRevoking] = useState(false)
  const [revokeError, setRevokeError] = useState<string | null>(null)

  const handleLogoutEverywhere = async () => {
    setIsRevoking(true)
    setRevokeError(null)

    try {
      await logoutEverywhere()
      // The auth store signs out on success, so this page unmounts behind the
      // redirect. Nothing further to show.
    } catch (error) {
      setRevokeError(
        error instanceof ApiError
          ? error.message
          : 'Could not sign out of your other devices.',
      )
    } finally {
      setIsRevoking(false)
    }
  }

  return (
    <div className="page container">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to={ROUTES.profile}>Profile</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Security</span>
      </nav>

      <h1 className="page__title">Security</h1>
      <p className="page__subtitle">Manage your password and active sessions.</p>

      <div className="security-layout">
        <Card title="Change password">
          <ChangePasswordForm />
        </Card>

        <Card
          title="Log out everywhere"
          description="Ends every session on every device, including this one."
        >
          <div className="security-actions">
            {revokeError && <Alert tone="error">{revokeError}</Alert>}
            <p className="profile-note">
              Use this if you think someone else has your password. It revokes every
              session and rotates the key your tokens are encrypted with, so nothing
              issued before now can be used again.
            </p>
            <Button
              variant="danger"
              onClick={() => void handleLogoutEverywhere()}
              isLoading={isRevoking}
              loadingText="Signing out…"
            >
              Log out of all devices
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
