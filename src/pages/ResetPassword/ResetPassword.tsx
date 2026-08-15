import { useSearchParams } from 'react-router-dom'

import { Alert } from '@/components/Alert'
import { Card } from '@/components/Card'
import { ResetPasswordForm } from '@/features/auth'

import './ResetPassword.css'

/**
 * The destination of a password-reset link: `/reset-password?token=…`.
 *
 * A route rather than a modal, because it is reached from an email rather than
 * from a button inside the app.
 */
export function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  return (
    <div className="page container">
      <div className="reset-layout">
        <h1 className="page__title">Set a new password</h1>
        <p className="page__subtitle">Choose a password you don&apos;t use anywhere else.</p>

        <Card>
          {token ? (
            <ResetPasswordForm token={token} />
          ) : (
            <Alert tone="error">
              This reset link is missing its token. Request a new link from the login
              screen.
            </Alert>
          )}
        </Card>
      </div>
    </div>
  )
}
