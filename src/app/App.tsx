import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Header } from '@/components/Header'
import { ROUTES } from '@/constants'
import { AuthModal, useAuth, useAuthModal } from '@/features/auth'

import { AppRouter } from './router'

import './App.css'

/**
 * The application shell: header, routed content, and the auth dialog.
 *
 * This is where the presentational `Header` is wired to auth state. Keeping the
 * wiring here rather than inside the component is what lets `components/`
 * remain generic and free of feature knowledge.
 */
export function App() {
  const { user, isLoading, logout } = useAuth()
  const { open } = useAuthModal()
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      // Revokes the session server-side. The Mongo record is marked inactive,
      // so the credential stops working for anyone holding it — not merely
      // forgotten by this tab.
      await logout()
      // Leave any protected page they were on; it would redirect anyway, and
      // this way the transition is deliberate rather than a bounce.
      navigate(ROUTES.home)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="app">
      <Header
        user={user}
        isLoading={isLoading}
        onLogin={() => open('login')}
        onSignup={() => open('signup')}
        onLogout={() => void handleLogout()}
        isLoggingOut={isLoggingOut}
      />

      <main className="app__main">
        <AppRouter />
      </main>

      {/* Mounted once at the root so any component can open it via
          useAuthModal(), without prop-drilling or a second instance. */}
      <AuthModal />

      <footer className="app__footer">
        <div className="container app__footer-inner">
          <span>LogisticPartner</span>
          <span>On-demand logistics, from A to B.</span>
        </div>
      </footer>
    </div>
  )
}
