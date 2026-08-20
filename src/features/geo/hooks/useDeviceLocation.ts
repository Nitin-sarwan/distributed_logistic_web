import { useCallback, useEffect, useRef, useState } from 'react'

import type { LatLng } from '@/components/Map'

export interface UseDeviceLocationResult {
  request: () => Promise<LatLng | null>
  isLocating: boolean
  error: string | null
  isDenied: boolean
  clearError: () => void
}

const UNSUPPORTED =
  'This browser cannot share a location. Search for the address or place the pin on the map.'

const DENIED =
  'Location access is blocked for this site. Allow it in your browser settings, or place the pin on the map.'

const UNAVAILABLE =
  'We could not read your location. Try again, or place the pin on the map.'

export function useDeviceLocation(): UseDeviceLocationResult {
  const [isLocating, setIsLocating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDenied, setIsDenied] = useState(false)

  const isMounted = useRef(true)
  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  const request = useCallback(() => {
    setError(null)
    setIsDenied(false)

    if (!('geolocation' in navigator)) {
      setError(UNSUPPORTED)
      return Promise.resolve(null)
    }

    setIsLocating(true)

    return new Promise<LatLng | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (isMounted.current) setIsLocating(false)
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (failure) => {
          if (isMounted.current) {
            setIsLocating(false)
            const denied = failure.code === failure.PERMISSION_DENIED
            setIsDenied(denied)
            setError(denied ? DENIED : UNAVAILABLE)
          }
          resolve(null)
        },
        {
          enableHighAccuracy: true,
          timeout: 10_000,
          maximumAge: 30_000,
        },
      )
    })
  }, [])

  const clearError = useCallback(() => {
    setError(null)
    setIsDenied(false)
  }, [])

  return { request, isLocating, error, isDenied, clearError }
}
