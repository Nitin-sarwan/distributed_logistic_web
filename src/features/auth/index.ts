/**
 * Public surface of the auth feature.
 *
 * Everything outside `features/auth/` imports from here, never from a file
 * inside. That keeps the feature's internals free to move without a
 * cross-codebase rename, and makes it obvious what the feature actually offers.
 */

export { AuthProvider } from './authStore'
export type { AuthContextValue } from './authStore'
export { AuthModalProvider } from './authModalStore'
export type { AuthModalContextValue } from './authModalStore'

export { useAuth } from './hooks/useAuth'
export { useAuthModal } from './hooks/useAuthModal'
export { useRequireAuth } from './hooks/useRequireAuth'

export { AuthModal } from './components/AuthModal'
export { LoginForm } from './components/LoginForm'
export { SignupForm } from './components/SignupForm'
export { RequireAuth } from './components/RequireAuth'
export { ChangePasswordForm } from './components/ChangePasswordForm'
export { ResetPasswordForm } from './components/ResetPasswordForm'
export { ForgotPasswordForm } from './components/ForgotPasswordForm'

export type {
  AuthState,
  AuthModalView,
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from './types'
