import type { LatLng } from '@/components/Map'

export interface Place {
  latitude: number
  longitude: number
  label: string
  address_line1: string
  address_line2: string | null
  city: string
  pin_code: string | null
  place_id: string
}

export interface ReverseGeocodeResult {
  latitude: number
  longitude: number
  place: Place | null
  /** False for a point in a country we do not deliver to (e.g. Nepal). */
  in_service_area?: boolean
}

export interface PickedLocation extends LatLng {
  place: Place | null
}

export type GeoSearchError =
  | 'rate-limited'
  | 'unavailable'
