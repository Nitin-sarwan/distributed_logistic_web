import { useCallback, useMemo, useState } from 'react'

import type { MapMarker } from '@/components/Map'
import {
  distanceKm,
  formatDistance,
  reverseGeocode,
  useDeviceLocation,
  type Place,
} from '@/features/geo'

import { EMPTY_ENDPOINT, type Endpoint } from '../types'

// Phone GPS outdoors is typically under 30 m; Wi-Fi positioning 50–500 m; IP
// geolocation is kilometres. Past this, the street is a guess.
const APPROXIMATE_METRES = 150

const OUTSIDE_SERVICE_AREA =
  'Your location appears to be outside India, where we do not deliver yet. Search for the address instead.'

export interface UseBookingResult {
  pickup: Endpoint
  drop: Endpoint
  setPickupText: (text: string) => void
  setDropText: (text: string) => void
  selectPickup: (place: Place) => void
  selectDrop: (place: Place) => void
  useCurrentPickup: () => Promise<void>
  isLocating: boolean
  /** Why "use my location" did nothing, or a warning that it was approximate. */
  locationNotice: { tone: 'error' | 'warning'; message: string } | null
  markers: MapMarker[]
  center: MapMarker['position'] | null
  straightLineKm: number | null
  canSubmit: boolean
}

export function useBooking(): UseBookingResult {
  const [pickup, setPickup] = useState<Endpoint>(EMPTY_ENDPOINT)
  const [drop, setDrop] = useState<Endpoint>(EMPTY_ENDPOINT)
  const { request, isLocating, error: locationError } = useDeviceLocation()
  const [accuracyWarning, setAccuracyWarning] = useState<string | null>(null)
  const [serviceAreaError, setServiceAreaError] = useState<string | null>(null)

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
    setAccuracyWarning(null)
    setServiceAreaError(null)
    const fix = await request()
    if (!fix) return

    const { accuracy, ...position } = fix

    // Laptops and desktops usually locate by Wi-Fi or IP, not GPS, and can be
    // off by hundreds of metres or more. Say so, rather than let a confident-
    // looking address send the driver to the wrong street.
    if (accuracy > APPROXIMATE_METRES) {
      setAccuracyWarning(
        `Your location is approximate (within about ${formatDistance(accuracy / 1000)}). ` +
          'Check the address, or search for your street or a landmark instead.',
      )
    }

    const fallback: Place = {
      ...position,
      label: 'My current location',
      address_line1: 'My current location',
      address_line2: null,
      city: '',
      pin_code: null,
      place_id: 'device-location',
    }
    setPickup({ text: fallback.label, place: fallback })

    // Look up what is actually here, so the order snapshots a street, a city
    // and a PIN code rather than "My current location". Keep the device's own
    // coordinates: they are more precise than the address's.
    try {
      const { place, in_service_area } = await reverseGeocode(position)
      if (in_service_area === false) {
        // The browser's own check is a box around India, which also contains
        // Nepal and Bangladesh; the geocoder knows the actual country.
        setPickup((current) =>
          current.place?.place_id === 'device-location' ? EMPTY_ENDPOINT : current,
        )
        setAccuracyWarning(null)
        setServiceAreaError(OUTSIDE_SERVICE_AREA)
        return
      }
      if (!place) return
      setPickup((current) =>
        current.place?.place_id === 'device-location'
          ? { text: place.label, place: { ...place, ...position } }
          : current,
      )
    } catch {
      // The fallback stands; the booking form asks for the PIN code.
    }
  }, [request])

  return {
    pickup,
    drop,
    // A pickup the user typed or chose replaces the device's guess, and with it
    // the warning about how good that guess was.
    setPickupText: useCallback((text: string) => {
      setAccuracyWarning(null)
      setServiceAreaError(null)
      setPickup({ text, place: null })
    }, []),
    setDropText: useCallback((text: string) => setDrop({ text, place: null }), []),
    selectPickup: useCallback((place: Place) => {
      setAccuracyWarning(null)
      setServiceAreaError(null)
      setPickup({ text: place.label, place })
    }, []),
    selectDrop: useCallback((place: Place) => setDrop({ text: place.label, place }), []),
    useCurrentPickup,
    isLocating,
    locationNotice: (locationError ?? serviceAreaError)
      ? { tone: 'error', message: (locationError ?? serviceAreaError) as string }
      : accuracyWarning
        ? { tone: 'warning', message: accuracyWarning }
        : null,
    markers,
    center: drop.place ?? pickup.place,
    straightLineKm:
      pickup.place && drop.place ? distanceKm(pickup.place, drop.place) : null,
    canSubmit: pickup.text.trim().length > 0 && drop.text.trim().length > 0,
  }
}
