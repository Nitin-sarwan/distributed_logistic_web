import { Link } from 'react-router-dom'

import { cx } from '@/utils'

import type { AppNotification, NotificationAudience } from '../types'
import { categoryLabel, relativeTime, resolveActionPath } from '../utils'

export interface NotificationItemProps {
  notification: AppNotification
  audience: NotificationAudience
  onRead: (id: number) => void
}

export function NotificationItem({ notification, audience, onRead }: NotificationItemProps) {
  const unread = notification.read_at === null
  const target = resolveActionPath(audience, notification.action_path)

  const content = (
    <>
      <span className="notice__dot" aria-hidden="true" />
      <span className="notice__body">
        <span className="notice__meta">
          {categoryLabel(notification.category)} ·{' '}
          <time dateTime={notification.created_at}>{relativeTime(notification.created_at)}</time>
          {unread && <span className="sr-only"> · unread</span>}
        </span>
        <span className="notice__title">{notification.title}</span>
        <span className="notice__text">{notification.body}</span>
      </span>
    </>
  )

  const className = cx('notice', unread && 'notice--unread')

  return (
    <li>
      {target ? (
        <Link to={target} className={className} onClick={() => onRead(notification.id)}>
          {content}
        </Link>
      ) : (
        <button type="button" className={className} onClick={() => onRead(notification.id)}>
          {content}
        </button>
      )}
    </li>
  )
}
