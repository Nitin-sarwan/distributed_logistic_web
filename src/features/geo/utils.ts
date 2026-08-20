import type { LatLng } from '@/components/Map'

import type { Place } from './types'

export function formatCoordinates({ latitude, longitude }: LatLng): string {
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
}

const EARTH_RADIUS_KM = 6371

const toRadians = (degrees: number) => (degrees * Math.PI) / 180

export function distanceKm(from: LatLng, to: LatLng): number {
  const deltaLatitude = toRadians(to.latitude - from.latitude)
  const deltaLongitude = toRadians(to.longitude - from.longitude)

  const halfChord =
    Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(toRadians(from.latitude)) *
      Math.cos(toRadians(to.latitude)) *
      Math.sin(deltaLongitude / 2) ** 2

  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(halfChord)))
}

export function formatDistance(kilometres: number): string {
  if (kilometres < 1) return `${Math.round(kilometres * 1000)} m`
  return `${kilometres.toFixed(1)} km`
}

export function shortLabel(place: Place): string {
  return [place.address_line1, place.address_line2, place.city]
    .filter(Boolean)
    .join(', ')
}

export function labelContext(place: Place): string {
  const short = shortLabel(place)
  if (!place.label.startsWith(short)) return place.label
  return place.label.slice(short.length).replace(/^[,\s]+/, '')
}
