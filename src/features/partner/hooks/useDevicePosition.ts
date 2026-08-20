import { useCallback } from 'react'

import type { LocationPayload } from '../types'

export function useDevicePosition(): () => Promise<LocationPayload | null> {
  return useCallback(() => {
    if (!('geolocation' in navigator)) return Promise.resolve(null)

    return new Promise<LocationPayload | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 10_000, maximumAge: 30_000 },
      )
    })
  }, [])
}
