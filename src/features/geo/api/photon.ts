/**
 * Type-ahead search straight from the browser to Photon (OpenStreetMap
 * autocomplete).
 *
 * Why the browser and not the backend: Photon's public server refuses
 * connections from Render's cloud IP range ("All connection attempts failed"
 * in the backend logs), while it answers browsers normally and allows
 * cross-origin calls. Each visitor's own connection is also the fair-use shape
 * Photon asks for. The backend's /api/geo/search stays as the fallback (see
 * geoApi.searchPlaces), and does the same filtering with Nominatim.
 *
 * The mapping mirrors the backend's utils/geocoder.py so a suggestion looks the
 * same whichever path produced it.
 */
import type { LatLng } from '@/components/Map'

import type { Place } from '../types'

const PHOTON_URL = 'https://photon.komoot.io/api/'

// min_lon, min_lat, max_lon, max_lat — the backend's INDIA_BBOX.
const INDIA_BBOX = '68.1,6.5,97.4,35.7'

// A stalled request must not hold the suggestion list hostage; the backend
// fallback is better than a spinner.
const TIMEOUT_MS = 4000

const NOISE: Record<string, Set<string> | null> = {
  man_made: null,
  power: null,
  waterway: null,
  barrier: null,
  highway: new Set(['bus_stop', 'platform', 'street_lamp', 'traffic_signals', 'crossing']),
  public_transport: new Set(['platform', 'stop_position']),
  railway: new Set(['platform', 'stop', 'subway_entrance', 'switch', 'level_crossing']),
  amenity: new Set(['bench', 'waste_basket', 'toilets', 'drinking_water', 'parking_entrance']),
}

const ADMIN_SUFFIX =
  /\s+(?:(?:Central|North|South|East|West|Greater)\s+)?(?:Municipal Corporation|City Corporation|Municipal Council|Nagar Nigam|Nagar Palika|Cantonment Board|Metropolitan City|Tehsil|Taluka|Taluk|taluku|Subdistrict|Sub-District|Mandal|Block)$/i

interface PhotonProperties {
  name?: string
  housenumber?: string
  street?: string
  locality?: string
  district?: string
  city?: string
  county?: string
  state?: string
  postcode?: string
  countrycode?: string
  osm_type?: string
  osm_id?: number
  osm_key?: string
  osm_value?: string
}

interface PhotonFeature {
  geometry?: { coordinates?: [number, number] }
  properties?: PhotonProperties
}

function cleanAdmin(name: string | undefined): string | undefined {
  if (!name) return name
  const cleaned = name.trim().replace(ADMIN_SUFFIX, '').trim()
  return cleaned || name.trim()
}

function composeLabel(...parts: Array<string | null | undefined>): string {
  const seen = new Set<string>()
  const kept: string[] = []
  for (const part of parts) {
    const value = part?.trim()
    if (!value) continue
    const key = value.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    kept.push(value)
  }
  return kept.join(', ')
}

function pinCode(postcode: string | undefined): string | null {
  const digits = (postcode ?? '').replace(/\D/g, '')
  return digits.length === 6 ? digits : null
}

function isNoise(p: PhotonProperties): boolean {
  if (!p.osm_key || !(p.osm_key in NOISE)) return false
  const values = NOISE[p.osm_key]
  return values === null || values.has(p.osm_value ?? '')
}

function toPlace(feature: PhotonFeature): Place | null {
  const p = feature.properties ?? {}
  if (p.countrycode?.toUpperCase() !== 'IN' || isNoise(p)) return null

  const [longitude, latitude] = feature.geometry?.coordinates ?? []
  if (typeof latitude !== 'number' || typeof longitude !== 'number') return null

  const line1 =
    p.housenumber && p.street
      ? `${p.housenumber}, ${p.street}`
      : p.name ?? p.street
  if (!line1) return null

  // Photon often leaves `city` empty for Indian suburbs; fall back outwards.
  const city = cleanAdmin(p.city ?? p.county ?? p.district ?? p.state) ?? ''
  const exclude = new Set([line1.toLowerCase(), city.toLowerCase()])
  const line2 =
    [cleanAdmin(p.locality), cleanAdmin(p.district), p.name && p.street ? p.street : undefined].find(
      (part): part is string => !!part && !exclude.has(part.toLowerCase()),
    ) ?? null
  const pin = pinCode(p.postcode)

  return {
    latitude,
    longitude,
    label: composeLabel(line1, line2, city, p.state, pin),
    address_line1: line1,
    address_line2: line2,
    city,
    pin_code: pin,
    place_id: `photon:${p.osm_type ?? ''}${p.osm_id ?? `${latitude},${longitude}`}`,
  }
}

function dedupe(places: Place[], limit: number): Place[] {
  const labels = new Set<string>()
  const spots = new Set<string>()
  const kept: Place[] = []
  for (const place of places) {
    const label = place.label.toLowerCase()
    const spot = `${place.address_line1.toLowerCase()}|${place.latitude.toFixed(3)}|${place.longitude.toFixed(3)}`
    if (labels.has(label) || spots.has(spot)) continue
    labels.add(label)
    spots.add(spot)
    kept.push(place)
    if (kept.length === limit) break
  }
  return kept
}

/** "Celebal Technologies, jaipur" → Jaipur results first, order kept within each group. */
function preferNamedArea(query: string, places: Place[]): Place[] {
  if (!query.includes(',')) return places
  const area = query.slice(query.lastIndexOf(',') + 1).trim().toLowerCase()
  if (area.length < 3) return places
  return [...places].sort(
    (a, b) => Number(!a.label.toLowerCase().includes(area)) - Number(!b.label.toLowerCase().includes(area)),
  )
}

export async function photonSearch(
  query: string,
  { limit = 6, near = null, signal }: { limit?: number; near?: LatLng | null; signal?: AbortSignal } = {},
): Promise<Place[]> {
  const params = new URLSearchParams({
    q: query,
    // Only a few spare: Photon re-ranks a larger candidate set worse.
    limit: String(limit + 3),
    lang: 'en',
    bbox: INDIA_BBOX,
  })
  for (const tag of ['!highway:bus_stop', '!public_transport:platform', '!public_transport:stop_position']) {
    params.append('osm_tag', tag)
  }
  if (near) {
    params.set('lat', String(near.latitude))
    params.set('lon', String(near.longitude))
    params.set('zoom', '12')
    params.set('location_bias_scale', '0.2')
  }

  const timeout = new AbortController()
  const timer = window.setTimeout(() => timeout.abort(), TIMEOUT_MS)
  const onAbort = () => timeout.abort()
  signal?.addEventListener('abort', onAbort)

  try {
    const response = await fetch(`${PHOTON_URL}?${params}`, { signal: timeout.signal })
    if (!response.ok) throw new Error(`Photon answered ${response.status}`)
    const body = (await response.json()) as { features?: PhotonFeature[] }
    const places = (body.features ?? []).map(toPlace).filter((place): place is Place => place !== null)
    return preferNamedArea(query, dedupe(places, limit))
  } finally {
    window.clearTimeout(timer)
    signal?.removeEventListener('abort', onAbort)
  }
}
