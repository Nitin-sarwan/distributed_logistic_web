export { AuthProvider } from './context/AuthProvider'
export { AuthContext } from './context/AuthContext'
export type { AuthContextValue } from './context/AuthContext'
export { authReducer, initialAuthState } from './context/authReducer'
export type { AuthAction } from './context/authReducer'
export { AuthModalProvider } from './authModalStore'
export type { AuthModalContextValue } from './authModalStore'

export { useAuth } from './hooks/useAuth'
export { useLogout } from './hooks/useLogout'
export { useLogoutEverywhere } from './hooks/useLogoutEverywhere'
export type { UseLogoutEverywhereResult } from './hooks/useLogoutEverywhere'
export type { UseLogoutResult } from './hooks/useLogout'
export { useAuthModal } from './hooks/useAuthModal'
export { useRequireAuth } from './hooks/useRequireAuth'

export { AuthModal } from './components/AuthModal'
export { LoginForm } from './components/LoginForm'
export { SignupForm } from './components/SignupForm'
export { RequireAuth } from './components/RequireAuth'
export { ChangePasswordForm } from './components/ChangePasswordForm'
export { LogoutEverywhereCard } from './components/LogoutEverywhereCard'
export { ResetPasswordForm } from './components/ResetPasswordForm'
export { ForgotPasswordForm } from './components/ForgotPasswordForm'

export type {
  AuthState,
  AuthModalView,
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from './types'
