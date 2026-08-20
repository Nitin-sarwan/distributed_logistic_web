import { useCallback, useMemo, useState } from 'react'

import type { MapMarker } from '@/components/Map'
import { distanceKm, useDeviceLocation, type Place } from '@/features/geo'

import { EMPTY_ENDPOINT, type Endpoint } from '../types'

export interface UseBookingResult {
  pickup: Endpoint
  drop: Endpoint
  setPickupText: (text: string) => void
  setDropText: (text: string) => void
  selectPickup: (place: Place) => void
  selectDrop: (place: Place) => void
  useCurrentPickup: () => Promise<void>
  isLocating: boolean
  markers: MapMarker[]
  center: MapMarker['position'] | null
  straightLineKm: number | null
  canSubmit: boolean
}

export function useBooking(): UseBookingResult {
  const [pickup, setPickup] = useState<Endpoint>(EMPTY_ENDPOINT)
  const [drop, setDrop] = useState<Endpoint>(EMPTY_ENDPOINT)
  const { request, isLocating } = useDeviceLocation()

  const markers = useMemo<MapMarker[]>(() => {
    const pins: MapMarker[] = []
    if (pickup.place) {
      pins.push({ id: 'pickup', position: pickup.place, tone: 'pickup', label: 'Pickup' })
    }
    if (drop.place) {
      pins.push({ id: 'drop', position: drop.place, tone: 'drop', label: 'Drop' })
    }
    return pins
  }, [pickup.place, drop.place])

  const useCurrentPickup = useCallback(async () => {
    const position = await request()
    if (!position) return

    setPickup({
      text: 'My current location',
      place: {
        ...position,
        label: 'My current location',
        address_line1: 'My current location',
        address_line2: null,
        city: '',
        pin_code: null,
        place_id: 'device-location',
      },
    })
  }, [request])

  return {
    pickup,
    drop,
    setPickupText: useCallback((text: string) => setPickup({ text, place: null }), []),
    setDropText: useCallback((text: string) => setDrop({ text, place: null }), []),
    selectPickup: useCallback((place: Place) => setPickup({ text: place.label, place }), []),
    selectDrop: useCallback((place: Place) => setDrop({ text: place.label, place }), []),
    useCurrentPickup,
    isLocating,
    markers,
    center: drop.place ?? pickup.place,
    straightLineKm:
      pickup.place && drop.place ? distanceKm(pickup.place, drop.place) : null,
    canSubmit: pickup.text.trim().length > 0 && drop.text.trim().length > 0,
  }
}
