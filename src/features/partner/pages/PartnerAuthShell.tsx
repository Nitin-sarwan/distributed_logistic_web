import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { ROUTES } from '@/constants'

import './PartnerAuth.css'

export function PartnerAuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) {
  return (
    <div className="partner-auth">
      <div className="partner-auth__panel">
        <Link to={ROUTES.partner} className="partner-auth__brand">
          <span className="partner-auth__logo" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
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
          LogisticPartner
          <span className="partner-auth__tag">Partner</span>
        </Link>

        <h1 className="partner-auth__title">{title}</h1>
        <p className="partner-auth__subtitle">{subtitle}</p>

        {children}

        <p className="partner-auth__aside">
          Looking to send a parcel? <Link to={ROUTES.home}>Go to the customer site</Link>
        </p>
      </div>
    </div>
  )
}
