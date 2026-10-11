import { useCallback, useEffect, useState } from 'react'

import { useIsMounted } from '@/hooks'
import { ApiError, errorMessage, isSessionEnded } from '@/services'

import * as notificationApi from '../api/notificationApi'
import type { AppNotification, NotificationAudience } from '../types'
import { publishUnread } from '../unreadChannel'

const PAGE_SIZE = 20

export interface UseNotificationFeedResult {
  items: AppNotification[]
  unreadCount: number
  unreadOnly: boolean
  setUnreadOnly: (value: boolean) => void
  isLoading: boolean
  isLoadingMore: boolean
  hasMore: boolean
  error: string | null
  unavailable: boolean
  loadMore: () => Promise<void>
  markRead: (id: number) => Promise<void>
  markAllRead: () => Promise<void>
  isMarkingAll: boolean
}

export function useNotificationFeed(audience: NotificationAudience): UseNotificationFeedResult {
  const [items, setItems] = useState<AppNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [unavailable, setUnavailable] = useState(false)
  const [isMarkingAll, setIsMarkingAll] = useState(false)
  const isMounted = useIsMounted()

  // The bell lives in the header and outlives this page — tapping a message
  // usually navigates away — so it hears the new count even after unmount.
  const applyCount = useCallback(
    (count: number) => {
      publishUnread(audience, count)
      if (isMounted.current) setUnreadCount(count)
    },
    [audience, isMounted],
  )

  const fetchPage = useCallback(
    async (offset: number) => {
      const page = await notificationApi.getFeed(audience, {
        unreadOnly,
        limit: PAGE_SIZE,
        offset,
      })
      if (!isMounted.current) return
      setItems((current) => (offset === 0 ? page.items : [...current, ...page.items]))
      setHasMore(page.items.length === PAGE_SIZE)
      applyCount(page.unread_count)
      setUnavailable(false)
      setError(null)
    },
    [applyCount, audience, isMounted, unreadOnly],
  )

  const handleError = useCallback(
    (caught: unknown, fallback: string) => {
      if (!isMounted.current || isSessionEnded(caught)) return
      const notBuilt = caught instanceof ApiError && (caught.isNotFound || caught.status === 502)
      setUnavailable(notBuilt)
      if (!notBuilt) setError(errorMessage(caught, fallback))
    },
    [isMounted],
  )

  useEffect(() => {
    setIsLoading(true)
    fetchPage(0)
      .catch((caught) => handleError(caught, 'Could not load your notifications.'))
      .finally(() => {
        if (isMounted.current) setIsLoading(false)
      })
  }, [fetchPage, handleError, isMounted])

  const loadMore = useCallback(async () => {
    setIsLoadingMore(true)
    try {
      await fetchPage(items.length)
    } catch (caught) {
      handleError(caught, 'Could not load more notifications.')
    } finally {
      if (isMounted.current) setIsLoadingMore(false)
    }
  }, [fetchPage, handleError, isMounted, items.length])

  const markRead = useCallback(
    async (id: number) => {
      const target = items.find((item) => item.id === id)
      if (!target || target.read_at) return

      // Optimistic: opening a message should not wait on a round trip to look
      // read. The server's count, when it arrives, is the one that sticks.
      const readAt = new Date().toISOString()
      setItems((current) =>
        current.map((item) => (item.id === id ? { ...item, read_at: readAt } : item)),
      )
      try {
        const result = await notificationApi.markRead(audience, id)
        applyCount(result.unread_count)
      } catch {
        // Left looking read. The next load shows the truth, and a read marker
        // is not worth an error message.
      }
    },
    [applyCount, audience, isMounted, items],
  )

  const markAllRead = useCallback(async () => {
    setIsMarkingAll(true)
    try {
      await notificationApi.markAllRead(audience)
      if (!isMounted.current) return
      const readAt = new Date().toISOString()
      setItems((current) =>
        unreadOnly ? [] : current.map((item) => ({ ...item, read_at: item.read_at ?? readAt })),
      )
      applyCount(0)
    } catch (caught) {
      handleError(caught, 'Could not mark everything as read.')
    } finally {
      if (isMounted.current) setIsMarkingAll(false)
    }
  }, [applyCount, audience, handleError, isMounted, unreadOnly])

  return {
    items,
    unreadCount,
    unreadOnly,
    setUnreadOnly,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    unavailable,
    loadMore,
    markRead,
    markAllRead,
    isMarkingAll,
  }
}
