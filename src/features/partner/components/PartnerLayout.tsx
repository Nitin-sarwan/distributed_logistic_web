import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { Loader } from '@/components/Loader'

import { usePartner } from '../hooks/usePartner'
import { PartnerHeader } from './PartnerHeader'
import { PartnerSidebar } from './PartnerSidebar'

import './PartnerLayout.css'

export function PartnerLayout() {
  const { partner, logout } = usePartner()
  const location = useLocation()

  const [isNavOpen, setIsNavOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    setIsNavOpen(false)
  }, [location.pathname])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (!partner) {
    return <Loader fullPage label="Loading your account…" />
  }

  return (
    <div className="partner-shell">
      <PartnerHeader
        partner={partner}
        onLogout={() => void handleLogout()}
        isLoggingOut={isLoggingOut}
        onToggleNav={() => setIsNavOpen((open) => !open)}
        isNavOpen={isNavOpen}
      />

      <div className="partner-shell__body">
        <div
          id="partner-nav"
          className={
            isNavOpen ? 'partner-shell__nav partner-shell__nav--open' : 'partner-shell__nav'
          }
        >
          <PartnerSidebar onNavigate={() => setIsNavOpen(false)} />
        </div>

        {isNavOpen && (
          <button
            type="button"
            className="partner-shell__scrim"
            aria-label="Close navigation"
            onClick={() => setIsNavOpen(false)}
          />
        )}

        <main className="partner-shell__main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
