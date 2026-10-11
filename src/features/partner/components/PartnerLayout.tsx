import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { Loader } from '@/components/Loader'
import { ROUTES } from '@/constants'
import { OfferPanel, useCurrentOffer } from '@/features/dispatch'

import {
  notifyDeliveriesChanged,
  refreshDeliveriesAfterAccept,
} from '../hooks/deliveriesChannel'
import { usePartner } from '../hooks/usePartner'
import { PartnerHeader } from './PartnerHeader'
import { PartnerSidebar } from './PartnerSidebar'

import './PartnerLayout.css'

// How quickly a driver who was released (cancelled or delivered) is noticed.
const ON_TRIP_REFRESH_MS = 8_000

export function PartnerLayout() {
  const { partner, logout, refreshPartner } = usePartner()
  const location = useLocation()
  const navigate = useNavigate()

  // Accepting moves the driver to on_trip, so the status pill and the
  // availability toggle need the fresh partner, and the job is on Deliveries.
  const handleAccepted = useCallback(() => {
    void refreshPartner()
    refreshDeliveriesAfterAccept()
    navigate(ROUTES.partnerDeliveries)
  }, [navigate, refreshPartner])

  // Dispatch hands the driver back (on_trip -> online) when the delivery ends
  // or the customer cancels, and nothing tells this screen. Re-read the
  // partner while they are on a trip, or a released driver keeps "On a
  // delivery" on screen and - worse - never polls for the next offer.
  const isOnTrip = partner?.status === 'on_trip'
  useEffect(() => {
    if (!isOnTrip) return
    const timer = window.setInterval(() => {
      void refreshPartner()
      notifyDeliveriesChanged()
    }, ON_TRIP_REFRESH_MS)
    return () => window.clearInterval(timer)
  }, [isOnTrip, refreshPartner])

  // Only an online driver can be offered work; polling anyone else is noise.
  const offer = useCurrentOffer(partner?.status === 'online', handleAccepted)

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
          <div className="partner-shell__offer">
            <OfferPanel {...offer} />
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
