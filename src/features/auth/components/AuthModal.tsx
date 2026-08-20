import { Modal } from '@/components/Modal'

import { useAuthModal } from '../hooks/useAuthModal'
import { ForgotPasswordForm } from './ForgotPasswordForm'
import { LoginForm } from './LoginForm'
import { SignupForm } from './SignupForm'

const TITLES = {
  login: 'Welcome back',
  signup: 'Create your account',
  'forgot-password': 'Reset your password',
} as const

export function AuthModal() {
  const { isOpen, view, close, setView, handleSuccess } = useAuthModal()

  return (
    <Modal
      isOpen={isOpen}
      onClose={close}
      title={TITLES[view]}
      size="md"

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
