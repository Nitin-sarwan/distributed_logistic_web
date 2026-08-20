import type { Place } from '@/features/geo'

export interface Endpoint {
  text: string
  place: Place | null
}

export interface BookingTrip {
  pickup: Endpoint
  drop: Endpoint
}

export const EMPTY_ENDPOINT: Endpoint = { text: '', place: null }
