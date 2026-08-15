import { Modal } from '@/components/Modal'

import { useAuthModal } from '../hooks/useAuthModal'
import { ForgotPasswordForm } from './ForgotPasswordForm'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SignupForm'

/** Dialog heading per view. */
const TITLES = {
  login: 'Welcome back',
  signup: 'Create your account',
  'forgot-password': 'Reset your password',
} as const

/**
 * One dialog, three views.
 *
 * Authentication happens in a modal rather than on its own route so the user is
 * never navigated away from what they were doing. Log in over the home page and
 * the pickup and drop locations already typed are still there afterwards.
 *
 * Mounted once, at the app root, so any component can open it through
 * `useAuthModal()` without threading props down the tree.
 */
export function AuthModal() {
  const { isOpen, view, close, setView, handleSuccess } = useAuthModal()

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      title={TITLES[view]}
      size="md"
      // Nothing here is destructive or long-running, so a backdrop click is a
      // reasonable cancel.
      closeOnBackdrop
    >
      {view === 'login' && (
        <LoginForm
          onSuccess={handleSuccess}
          onSwitchToSignup={() => setView('signup')}
          onForgotPassword={() => setView('forgot-password')}
        />
      )}

      {view === 'signup' && (
        <SignupForm onSuccess={handleSuccess} onSwitchToLogin={() => setView('login')} />
      )}

      {view === 'forgot-password' && (
        <ForgotPasswordForm onBackToLogin={() => setView('login')} />
      )}
    </Modal>
  )
}
