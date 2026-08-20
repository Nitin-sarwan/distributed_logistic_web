import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { ROUTES } from '@/constants'
import { initials } from '@/utils'
import type { User } from '@/types'

import './Header.css'

export interface ProfileMenuProps {
  user: User
  onLogout: () => void
  isLoggingOut: boolean
}

export function ProfileMenu({ user, onLogout, isLoggingOut }: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div className="profile-menu" ref={containerRef}>
      <button
        type="button"
        className="profile-menu__trigger"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={`Account menu for ${user.name}`}
      >
        <span className="profile-menu__avatar" aria-hidden="true">
          {initials(user.name)}
        </span>
      </button>

      {isOpen && (
        <div className="profile-menu__dropdown" role="menu">
          <div className="profile-menu__identity">
            <p className="profile-menu__name">{user.name}</p>
            <p className="profile-menu__email">{user.email}</p>
          </div>

          <Link
            to={ROUTES.profile}
            className="profile-menu__item"
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            Profile
          </Link>

          <Link
            to={ROUTES.addresses}
            className="profile-menu__item"
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            Saved addresses
          </Link>

          <button
            type="button"
            className="profile-menu__item profile-menu__item--danger"
            role="menuitem"
            onClick={() => {
              setIsOpen(false)
              onLogout()
            }}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Logging out…' : 'Logout'}
          </button>
        </div>
      )}
    </div>
  )
}
