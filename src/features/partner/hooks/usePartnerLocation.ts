import { useCallback, useMemo, useState } from 'react'

import type { LatLng, MapMarker } from '@/components/Map'

import { STALE_AFTER_MINUTES } from '../constants'
import { describeFreshness, isLocationStale, minutesSince } from '../utils'
import { usePartner } from './usePartner'

export interface UsePartnerLocationResult {
  position: LatLng | null
  markers: MapMarker[]
  freshness: string
  isStale: boolean
  isInvisibleToDispatch: boolean
  staleAfterMinutes: number
  isSharing: boolean
  wasDenied: boolean
  error: string | null
  share: () => Promise<void>
}

export function usePartnerLocation(): UsePartnerLocationResult {
  const { partner, pushLocation } = usePartner()
  const [isSharing, setIsSharing] = useState(false)
  const [wasDenied, setWasDenied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const latitude = partner?.current_latitude ?? null
  const longitude = partner?.current_longitude ?? null

  const position = useMemo<LatLng | null>(
    () => (latitude !== null && longitude !== null ? { latitude, longitude } : null),
    [latitude, longitude],
  )

  const markers = useMemo<MapMarker[]>(
    () =>
      position
        ? [{ id: 'partner', position, tone: 'partner', label: 'Your last known position' }]
        : [],
    [position],
  )

  const share = useCallback(async () => {
    setIsSharing(true)
    setError(null)
    setWasDenied(false)

    try {
      const shared = await pushLocation()
      setWasDenied(!shared)
    } catch {
      setError('Could not send your location. Try again.')
    } finally {
      setIsSharing(false)
    }
  }, [pushLocation])

  const stale = partner ? isLocationStale(partner) : true

  return {
    position,
    markers,
    freshness: describeFreshness(minutesSince(partner?.location_updated_at ?? null)),
    isStale: stale,
    isInvisibleToDispatch: stale && partner?.status === 'online',
    staleAfterMinutes: STALE_AFTER_MINUTES,
    isSharing,
    wasDenied,
    error,
    share,
  }
}
