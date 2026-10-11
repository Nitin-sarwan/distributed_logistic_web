export interface OfferCard {
  offer_id: number
  order_id: number
  public_ref: string
  pickup_city: string | null
  drop_city: string | null
  vehicle_type: string
  package_weight_kg: string
  trip_distance_km: string | null
  /** How far the driver is from the pickup — not the length of the trip. */
  pickup_distance_km: string
  amount: string | null
  currency: string
  expires_at: string
  /** Computed by the server so a phone with a fast clock does not cut the countdown short. */
  seconds_remaining: number
}

export type OfferStatus =
  | 'queued'
  | 'offered'
  | 'accepted'
  | 'declined'
  | 'expired'
  | 'lost_race'
  | 'superseded'

export interface OfferResponse {
  offer_id: number
  order_id: number
  status: OfferStatus
  responded_at: string | null
}
