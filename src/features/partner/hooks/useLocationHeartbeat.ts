import { useEffect } from 'react'

import { HEARTBEAT_INTERVAL_MS } from '../constants'

export function useLocationHeartbeat(
  isOnline: boolean,
  pushLocation: () => Promise<boolean>,
): void {
  useEffect(() => {
    if (!isOnline) return

    const timer = window.setInterval(() => {
      void pushLocation().catch(() => undefined)
    }, HEARTBEAT_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [isOnline, pushLocation])
}
