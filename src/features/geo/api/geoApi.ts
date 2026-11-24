import { API_ROUTES } from '@/constants'
import { ApiError, get } from '@/services'
import type { LatLng } from '@/components/Map'

import type { GeoSearchError, Place, ReverseGeocodeResult } from '../types'
import { photonSearch } from './photon'

export interface SearchOptions {
  limit?: number
  near?: LatLng | null
  signal?: AbortSignal
}

/**
 * Type-ahead: Photon from the browser first, the backend as the fallback.
 *
 * The backend cannot reach Photon (its host blocks Render's IPs), so without
 * this the search box only matches whole words. The fallback covers Photon
 * being down or slow, and queries it finds nothing for — full street addresses
 * with house numbers, which the backend's Nominatim is better at.
 */
export async function searchPlaces(query: string, options: SearchOptions = {}): Promise<Place[]> {
  const { limit, near, signal } = options

  try {
    const places = await photonSearch(query, { limit, near, signal })
    if (places.length > 0) return places
  } catch {
    // Fall through to the backend. A cancelled request is handled by the
    // caller, which checks its own signal before using any result.
  }

  return backendSearch(query, options)
}

function backendSearch(query: string, options: SearchOptions): Promise<Place[]> {
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
