import { Link } from 'react-router-dom'

import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Loader } from '@/components/Loader'
import { ROUTES } from '@/constants'
import { useAuth } from '@/features/auth'
import { ProfileDetails } from '@/features/profile'

import './Profile.css'

/**
 * The account page.
 *
 * A route-level screen and nothing more: it reads the user from auth state and
 * composes feature components. No API call is made here — that belongs to the
 * feature layer.
 */
export function Profile() {
  const { user, isLoading, logout } = useAuth()

  // RequireAuth has already resolved the session before this renders, so this
  // is only for the brief window where the user object is still settling.
  if (isLoading || !user) {
    return <Loader fullPage label="Loading your profile…" />
  }

  return (
    <div className="page container">
      <h1 className="page__title">Profile</h1>
      <p className="page__subtitle">Manage your account and delivery preferences.</p>

      <div className="profile-layout">
        <ProfileDetails user={user} />

        <Card
          title="Saved addresses"
          description="The places you send from and to, ready for your next booking."
          action={
            <Link to={ROUTES.addresses}>
              <Button variant="secondary" size="sm">
                Manage
              </Button>
            </Link>
          }
        >
          <p className="profile-note">
            Keep your home, office, or warehouse on file so booking a delivery takes
            seconds.
          </p>
        </Card>

        <Card
          title="Security"
          description="Change your password or sign out of every device."
          action={
            <Link to={ROUTES.security}>
              <Button variant="secondary" size="sm">
                Open
              </Button>
            </Link>
          }
        >
          <p className="profile-note">
            Changing your password signs you out everywhere. Use &ldquo;log out
            everywhere&rdquo; if you think someone else has your password.
          </p>
        </Card>

        <Card title="Session">
          <div className="profile-session">
            {/* No email here: it is already in Account details above, and
                repeating an identifier next to a destructive action adds
                nothing but another place it can be read over a shoulder. */}
            <p className="profile-note">
              Sign out of LogisticPartner on this device.
            </p>
            <Button variant="danger" onClick={() => void logout()}>
              Logout
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
