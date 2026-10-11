import { Link } from 'react-router-dom'

import { cx } from '@/utils'

import { useUnreadCount } from '../hooks/useUnreadCount'
import type { NotificationAudience } from '../types'
import { badgeText } from '../utils'

import './Notifications.css'

export interface NotificationBellProps {
  audience: NotificationAudience
  to: string
  /** `onBrand` for the partner header's dark background. */
  variant?: 'default' | 'onBrand'
}

export function NotificationBell({ audience, to, variant = 'default' }: NotificationBellProps) {
  const { count, capped } = useUnreadCount(audience)
  const label = count > 0 ? `Notifications, ${badgeText(count, capped)} unread` : 'Notifications'

  return (
    <Link
      to={to}
      className={cx('bell', variant === 'onBrand' && 'bell--on-brand')}
      aria-label={label}
      title={label}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
        <path
          d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <path d="M10 20a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.7" />
      </svg>
      {count > 0 && (
        <span className="bell__badge" aria-hidden="true">
          {badgeText(count, capped)}
        </span>
      )}
    </Link>
  )
}
