import { Header } from '@/components/Header'
import { useAuth, useAuthModal, useLogout } from '@/features/auth'

export function SiteHeader() {
  const { user, isLoading } = useAuth()
  const { open } = useAuthModal()
  const { logout, isLoggingOut } = useLogout()

  return (
    <Header
      user={user}
      isLoading={isLoading}
      onLogin={() => open('login')}
      onSignup={() => open('signup')}
      onLogout={() => void logout()}
      isLoggingOut={isLoggingOut}
    />
  )
}
