import { useEffect, useRef, useState } from 'react'

import type { LatLng } from '@/components/Map'

import { isAborted, reverseGeocode, toSearchError } from '../api/geoApi'
import type { GeoSearchError, Place } from '../types'

const DEBOUNCE_MS = 500

export interface UseReverseGeocodeResult {
  place: Place | null
  isResolving: boolean
  error: GeoSearchError | null
}

export function useReverseGeocode(
  position: LatLng | null,
  enabled = true,
): UseReverseGeocodeResult {
  const [place, setPlace] = useState<Place | null>(null)
  const [isResolving, setIsResolving] = useState(false)
  const [error, setError] = useState<GeoSearchError | null>(null)

  const key = position
    ? `${position.latitude.toFixed(6)},${position.longitude.toFixed(6)}`
    : null

  const positionRef = useRef(position)
  positionRef.current = position

  useEffect(() => {
    if (!enabled || !key || !positionRef.current) {
      setIsResolving(false)
      return
    }

    const controller = new AbortController()
    const target = positionRef.current
    setIsResolving(true)

    const timer = window.setTimeout(() => {
      reverseGeocode(target, controller.signal)
        .then((result) => {
          if (controller.signal.aborted) return

          setPlace(result.place)
          setError(null)
        })
        .catch((caught: unknown) => {
          if (controller.signal.aborted || isAborted(caught)) return
          setError(toSearchError(caught))
        })
        .finally(() => {
          if (!controller.signal.aborted) setIsResolving(false)
        })
    }, DEBOUNCE_MS)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [key, enabled])

  return { place, isResolving, error }
}
