import { Alert } from '@/components/Alert'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'

import { useLogoutEverywhere } from '../hooks/useLogoutEverywhere'

export function LogoutEverywhereCard() {
  const { logoutEverywhere, isRevoking, error } = useLogoutEverywhere()

  return (
    <Card
      title="Log out everywhere"
      description="Ends every session on every device, including this one."
    >
      <div className="security-actions">
        {error && <Alert tone="error">{error}</Alert>}

        <p className="profile-note">
          Use this if you think someone else has your password. It revokes every
          session and rotates the key your tokens are encrypted with, so nothing
          issued before now can be used again.
        </p>

        <Button
          variant="danger"
          onClick={() => void logoutEverywhere()}
          isLoading={isRevoking}
          loadingText="Signing out…"
        >
          Log out of all devices
        </Button>
      </div>
    </Card>
  )
}
