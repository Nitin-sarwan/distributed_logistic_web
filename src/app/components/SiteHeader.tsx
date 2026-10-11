import { Header } from '@/components/Header'
import { ROUTES } from '@/constants'
import { useAuth, useAuthModal, useLogout } from '@/features/auth'
import { NotificationBell } from '@/features/notifications'

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
      notifications={
        user ? <NotificationBell audience="customer" to={ROUTES.notifications} /> : null
      }
    />
  )
}
