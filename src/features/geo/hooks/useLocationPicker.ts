import { useCallback, useEffect, useRef, useState } from 'react'

import type { LatLng } from '@/components/Map'
import { isSamePoint } from '@/components/Map'

import type { PickedLocation, Place } from '../types'
import { useDeviceLocation } from './useDeviceLocation'
import { useReverseGeocode } from './useReverseGeocode'

export interface UseLocationPickerOptions {
  value: LatLng | null
  onChange: (picked: PickedLocation) => void
  fallbackCenter: LatLng
  autoLocate?: boolean
}

export interface UseLocationPickerResult {
  center: LatLng
  hasPoint: boolean
  place: Place | null
  isResolving: boolean
  isLocating: boolean
  locationError: string | null
  handleMoveEnd: (next: LatLng) => void
  useMyLocation: () => Promise<void>
}

export function useLocationPicker({
  value,
  onChange,
  fallbackCenter,
  autoLocate = false,
}: UseLocationPickerOptions): UseLocationPickerResult {
  const [center, setCenter] = useState<LatLng>(value ?? fallbackCenter)

  const [hasPoint, setHasPoint] = useState(value !== null)

  const { request, isLocating, error: locationError } = useDeviceLocation()
  const { place, isResolving } = useReverseGeocode(hasPoint ? center : null)

  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  const centerRef = useRef(center)
  centerRef.current = center

  useEffect(() => {
    if (!value) return
    setCenter((current) => (isSamePoint(current, value) ? current : value))
    setHasPoint(true)
  }, [value])

  useEffect(() => {
    if (!hasPoint || !place) return
    onChangeRef.current({ ...centerRef.current, place })
  }, [hasPoint, place])

  const commit = useCallback((next: LatLng) => {
    setCenter(next)
    setHasPoint(true)
    onChangeRef.current({ ...next, place: null })
  }, [])

  const handleMoveEnd = useCallback(
    (next: LatLng) => {
      if (isSamePoint(centerRef.current, next)) return
      commit(next)
    },
    [commit],
  )

  const useMyLocation = useCallback(async () => {
    const position = await request()
    if (!position) return
    commit(position)
  }, [commit, request])

  const hasAutoLocated = useRef(false)
  useEffect(() => {
    if (!autoLocate || hasAutoLocated.current || value) return
    hasAutoLocated.current = true
    void useMyLocation()
  }, [autoLocate, useMyLocation, value])

  return {
    center,
    hasPoint,
    place,
    isResolving,
    isLocating,
    locationError,
    handleMoveEnd,
    useMyLocation,
  }
}
