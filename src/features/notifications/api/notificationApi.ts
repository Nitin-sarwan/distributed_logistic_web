import { notificationRoutes, type NotificationAudience } from '@/constants'
import { get, patch, post } from '@/services'

import type {
  MarkReadResult,
  NotificationFeed,
  NotificationPreferences,
  PreferenceUpdate,
  UnreadCount,
} from '../types'

export interface FeedQuery {
  unreadOnly?: boolean
  limit?: number
  offset?: number
}

export function getFeed(
  audience: NotificationAudience,
  { unreadOnly = false, limit = 20, offset = 0 }: FeedQuery = {},
): Promise<NotificationFeed> {
  return get<NotificationFeed>(notificationRoutes(audience).feed, {
    params: { unread_only: unreadOnly, limit, offset },
  })
}

export function getUnreadCount(audience: NotificationAudience): Promise<UnreadCount> {
  return get<UnreadCount>(notificationRoutes(audience).unreadCount)
}

export function markRead(audience: NotificationAudience, id: number): Promise<MarkReadResult> {
  return post<MarkReadResult>(notificationRoutes(audience).read(id))
}

export function markAllRead(audience: NotificationAudience): Promise<MarkReadResult> {
  return post<MarkReadResult>(notificationRoutes(audience).readAll)
}

export function getPreferences(audience: NotificationAudience): Promise<NotificationPreferences> {
  return get<NotificationPreferences>(notificationRoutes(audience).preferences)
}

export function updatePreferences(
  audience: NotificationAudience,
  update: PreferenceUpdate,
): Promise<NotificationPreferences> {
  return patch<NotificationPreferences>(notificationRoutes(audience).preferences, update)
}
