import { useCallback, useEffect, useState } from 'react'

import { useIsMounted } from '@/hooks'

import { getUnreadCount } from '../api/notificationApi'
import type { NotificationAudience } from '../types'
import { subscribeUnread } from '../unreadChannel'

// The badge is the one thing polled on every page, so it is polled gently.
const POLL_INTERVAL_MS = 30_000

export interface UseUnreadCountResult {
  count: number
  capped: boolean
}

export function useUnreadCount(
  audience: NotificationAudience,
  enabled = true,
): UseUnreadCountResult {
  const [count, setCount] = useState(0)
  const [capped, setCapped] = useState(false)
  const isMounted = useIsMounted()

  const load = useCallback(async () => {
    try {
      const result = await getUnreadCount(audience)
      if (!isMounted.current) return
      setCount(result.count)
      setCapped(result.capped)
    } catch {
      // A badge that fails to update keeps its last number. Not worth an error
      // on every page when notificationServices is down.
    }
  }, [audience, isMounted])

  useEffect(() => {
    if (!enabled) {
      setCount(0)
      return
    }

    void load()
    const timer = window.setInterval(() => void load(), POLL_INTERVAL_MS)
    // Back on the tab is when a person looks at the badge — refresh it then.
    const onVisible = () => {
      if (document.visibilityState === 'visible') void load()
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [enabled, load])

  useEffect(
    () =>
      subscribeUnread(audience, (next) => {
        setCount(next)
        setCapped(false)
      }),
    [audience],
  )

  return { count, capped }
}
