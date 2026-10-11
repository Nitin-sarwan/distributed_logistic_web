import { Alert } from '@/components/Alert'
import { Button } from '@/components/Button'
import { EmptyState } from '@/components/EmptyState'
import { Loader } from '@/components/Loader'
import { cx } from '@/utils'

import { useNotificationFeed } from '../hooks/useNotificationFeed'
import type { NotificationAudience } from '../types'
import { NotificationItem } from './NotificationItem'

import './Notifications.css'

export interface NotificationCenterProps {
  audience: NotificationAudience
  emptyDescription: string
}

/** The feed: filter, list, mark all read, load more. */
export function NotificationCenter({ audience, emptyDescription }: NotificationCenterProps) {
  const feed = useNotificationFeed(audience)

  return (
    <section className="notice-center" aria-label="Notifications">
      <div className="notice-center__toolbar">
        <div className="notice-center__filters" role="group" aria-label="Show">
          <button
            type="button"
            className={cx('notice-filter', !feed.unreadOnly && 'notice-filter--active')}
            aria-pressed={!feed.unreadOnly}
            onClick={() => feed.setUnreadOnly(false)}
          >
            All
          </button>
          <button
            type="button"
            className={cx('notice-filter', feed.unreadOnly && 'notice-filter--active')}
            aria-pressed={feed.unreadOnly}
            onClick={() => feed.setUnreadOnly(true)}
          >
            Unread{feed.unreadCount > 0 ? ` (${feed.unreadCount})` : ''}
          </button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => void feed.markAllRead()}
          disabled={feed.unreadCount === 0}
          isLoading={feed.isMarkingAll}
          loadingText="Marking…"
        >
          Mark all read
        </Button>
      </div>

      {feed.isLoading && <Loader label="Loading notifications…" />}

      {!feed.isLoading && feed.unavailable && (
        <Alert tone="info">
          Notifications aren&apos;t reachable. Check that the Notification Service is
          running on its port and that the gateway routes it.
        </Alert>
      )}

      {feed.error && <Alert tone="error">{feed.error}</Alert>}

      {!feed.isLoading && !feed.unavailable && feed.items.length === 0 && !feed.error && (
        <EmptyState
          title={feed.unreadOnly ? 'You are all caught up' : 'No notifications yet'}
          description={feed.unreadOnly ? 'Nothing unread.' : emptyDescription}
        />
      )}

      {feed.items.length > 0 && (
        <ul className="notice-list">
          {feed.items.map((item) => (
            <NotificationItem
              key={item.id}
              notification={item}
              audience={audience}
              onRead={(id) => void feed.markRead(id)}
            />
          ))}
        </ul>
      )}

      {feed.hasMore && !feed.isLoading && (
        <Button
          variant="secondary"
          onClick={() => void feed.loadMore()}
          isLoading={feed.isLoadingMore}
          loadingText="Loading…"
        >
          Load older
        </Button>
      )}
    </section>
  )
}
