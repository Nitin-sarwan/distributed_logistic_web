import { NavLink } from 'react-router-dom'

import { ROUTES } from '@/constants'
import { cx } from '@/utils'

interface NavItem {
  to: string
  label: string
  icon: JSX.Element
  end?: boolean
}

const ICON_PROPS = {
  viewBox: '0 0 24 24',
  width: 20,
  height: 20,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const NAV_ITEMS: NavItem[] = [
  {
    to: ROUTES.partner,
    label: 'Dashboard',
    end: true,
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V20h14V9.5" />
      </svg>
    ),
  },
  {
    to: ROUTES.partnerDeliveries,
    label: 'Deliveries',
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M4 7h9v9H4z" />
        <path d="M13 10.5h4l3 3V16h-7z" />
        <circle cx="7.5" cy="18" r="1.6" />
        <circle cx="16.5" cy="18" r="1.6" />
      </svg>
    ),
  },
  {
    to: ROUTES.partnerVehicle,
    label: 'Vehicle',
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M5 16V9.5l2-3.5h10l2 3.5V16" />
        <path d="M3 16h18" />
        <circle cx="8" cy="18.2" r="1.6" />
        <circle cx="16" cy="18.2" r="1.6" />
      </svg>
    ),
  },
  {
    to: ROUTES.partnerProfile,
    label: 'Profile',
    icon: (
      <svg {...ICON_PROPS}>
        <circle cx="12" cy="8.5" r="3.5" />
        <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
      </svg>
    ),
  },
]

export function PartnerSidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="partner-sidebar" aria-label="Partner">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cx('partner-sidebar__link', isActive && 'partner-sidebar__link--active')
          }
        >
          <span className="partner-sidebar__icon" aria-hidden="true">
            {item.icon}
          </span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
