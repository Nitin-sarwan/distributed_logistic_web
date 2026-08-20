import { Link, NavLink } from 'react-router-dom'

import { Button } from '@/components/Button'
import { ROUTES } from '@/constants'
import { cx } from '@/utils'
import type { User } from '@/types'

import { ProfileMenu } from './ProfileMenu'

import './Header.css'

export interface HeaderProps {
  user: User | null
  isLoading: boolean
  onLogin: () => void
  onSignup: () => void
  onLogout: () => void
  isLoggingOut: boolean
}

export function Header({
  user,
  isLoading,
  onLogin,
  onSignup,
  onLogout,
  isLoggingOut,
}: HeaderProps) {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    cx('header__link', isActive && 'header__link--active')

  return (
    <header className="header">
      <div className="header__inner container">
        <Link to={ROUTES.home} className="header__brand">
          <span className="header__logo" aria-hidden="true">
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
          LogisticPartner
        </Link>

        <nav className="header__nav" aria-label="Main">

          <NavLink to={ROUTES.trackOrder} className={navClass}>
            Track order
          </NavLink>

          {user && (
            <NavLink to={ROUTES.orders} className={navClass}>
              My orders
            </NavLink>
          )}

          {isLoading ? (
            <span className="header__placeholder" aria-hidden="true" />
          ) : user ? (
            <ProfileMenu user={user} onLogout={onLogout} isLoggingOut={isLoggingOut} />
          ) : (
            <div className="header__auth">
              <Button variant="ghost" size="sm" onClick={onLogin}>
                Login
              </Button>
              <Button size="sm" onClick={onSignup}>
                Sign up
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
