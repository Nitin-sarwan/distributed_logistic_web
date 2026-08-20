import { useEffect } from 'react'

import { onSessionExpired, type SessionAudience } from '@/services'

export function useSessionProbe<T>(
  probe: () => Promise<T | null>,
  onResolved: (subject: T | null) => void,
): void {
  useEffect(() => {
    let cancelled = false

    const resolve = (subject: T | null) => {
      if (!cancelled) onResolved(subject)
    }

    probe().then(resolve, () => resolve(null))

    return () => {
      cancelled = true
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export function useSessionExpiry(audience: SessionAudience, onExpired: () => void): void {
  useEffect(
    () =>
      onSessionExpired((expired) => {
        if (expired === audience) onExpired()
      }),
    [audience, onExpired],
  )
}
