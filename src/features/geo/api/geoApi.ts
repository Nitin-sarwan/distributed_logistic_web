import { API_ROUTES } from '@/constants'
import { ApiError, get } from '@/services'
import type { LatLng } from '@/components/Map'

import type { GeoSearchError, Place, ReverseGeocodeResult } from '../types'

export interface SearchOptions {
  limit?: number
  near?: LatLng | null
  signal?: AbortSignal
}

export function searchPlaces(query: string, options: SearchOptions = {}): Promise<Place[]> {
  const { limit, near, signal } = options

  return get<Place[]>(API_ROUTES.geo.search, {
    params: {
      q: query,
      ...(limit ? { limit } : {}),
      ...(near ? { lat: near.latitude, lng: near.longitude } : {}),
    },
    signal,
  })
}

export function reverseGeocode(
  position: LatLng,
  signal?: AbortSignal,
): Promise<ReverseGeocodeResult> {
  return get<ReverseGeocodeResult>(API_ROUTES.geo.reverse, {
    params: { lat: position.latitude, lng: position.longitude },
    signal,
  })
}

export function toSearchError(error: unknown): GeoSearchError {
  return error instanceof ApiError && error.status === 429 ? 'rate-limited' : 'unavailable'
}

export function isAborted(error: unknown): boolean {
  return error instanceof ApiError && error.isCanceled
}
