import { useCallback, useEffect, useRef, useState } from 'react'

import type { LatLng } from '@/components/Map'

import { isInIndia } from '../utils'

export interface DeviceFix extends LatLng {
  /** Radius in metres the browser is ~68% sure the device is within. */
  accuracy: number
}

export interface UseDeviceLocationResult {
  request: () => Promise<DeviceFix | null>
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

const OUTSIDE_INDIA =
  'Your location appears to be outside India, where we do not deliver yet. Search for the address instead.'

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

    return new Promise<DeviceFix | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (isMounted.current) setIsLocating(false)
          const fix: DeviceFix = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          }
          if (!isInIndia(fix)) {
            if (isMounted.current) setError(OUTSIDE_INDIA)
            resolve(null)
            return
          }
          resolve(fix)
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
          timeout: 15_000,
          // Always a fresh fix. A cached one may be from before the user moved,
          // or a coarse Wi-Fi guess the browser made earlier.
          maximumAge: 0,
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
