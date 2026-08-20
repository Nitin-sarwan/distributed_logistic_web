import { Link } from 'react-router-dom'

import { Button } from '@/components/Button'
import { ROUTES } from '@/constants'
import { initials } from '@/utils'

import type { Partner } from '../types'
import { PartnerStatusPill } from './StatusPill'

export interface PartnerHeaderProps {
  partner: Partner
  onLogout: () => void
  isLoggingOut: boolean
  onToggleNav: () => void
  isNavOpen: boolean
}

export function PartnerHeader({
  partner,
  onLogout,
  isLoggingOut,
  onToggleNav,
  isNavOpen,
}: PartnerHeaderProps) {
  return (
    <header className="partner-header">
      <div className="partner-header__inner">
        <button
          type="button"
          className="partner-header__nav-toggle"
          onClick={onToggleNav}
          aria-expanded={isNavOpen}
          aria-controls="partner-nav"
          aria-label={isNavOpen ? 'Close navigation' : 'Open navigation'}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
            <path
              d={isNavOpen ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'}
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <Link to={ROUTES.partner} className="partner-header__brand">
          <span className="partner-header__logo" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
              <path
                d="M3 7.5h10.5v9H3z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M13.5 10.5H18l3 3v3h-7.5z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <circle cx="7" cy="17.5" r="1.8" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="17" cy="17.5" r="1.8" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </span>
          <span>
            LogisticPartner
            <span className="partner-header__tag">Partner</span>
          </span>
        </Link>

        <div className="partner-header__right">
          <PartnerStatusPill status={partner.status} />

          <Link to={ROUTES.partnerProfile} className="partner-header__identity">
            <span className="partner-header__avatar" aria-hidden="true">
              {initials(partner.name)}
            </span>
            <span className="partner-header__name">{partner.name}</span>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            isLoading={isLoggingOut}
            loadingText="Signing out…"
          >
            Sign out
          </Button>
        </div>
      </div>
    </header>
  )
}
