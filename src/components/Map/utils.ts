import L from 'leaflet'

import type { LatLng, MapMarkerTone } from './types'

export function toLeaflet({ latitude, longitude }: LatLng): L.LatLngTuple {
  return [latitude, longitude]
}

export function fromLeaflet(point: L.LatLng): LatLng {
  return { latitude: point.lat, longitude: point.lng }
}

export const COORDINATE_EPSILON = 1e-6

export function isSamePoint(a: LatLng, b: LatLng): boolean {
  return (
    Math.abs(a.latitude - b.latitude) < COORDINATE_EPSILON &&
    Math.abs(a.longitude - b.longitude) < COORDINATE_EPSILON
  )
}

export function pinIcon(tone: MapMarkerTone = 'default'): L.DivIcon {
  return L.divIcon({
    className: 'map-pin-wrapper',
    html: `<span class="map-pin map-pin--${tone}"></span>`,
    iconSize: [30, 38],
    iconAnchor: [15, 38],
  })
}

export function parseCenter(value: string | undefined): LatLng | null {
  if (!value) return null

  const [latitude, longitude] = value.split(',').map((part) => Number(part.trim()))
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null
  if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null

  return { latitude, longitude }
}

export const DEFAULT_CENTER: LatLng = parseCenter(
  import.meta.env.VITE_MAP_DEFAULT_CENTER,
) ?? { latitude: 12.971599, longitude: 77.594566 }
