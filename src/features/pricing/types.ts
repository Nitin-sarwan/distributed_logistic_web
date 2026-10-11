import type { LatLng } from '@/components/Map'

export type VehicleType = 'two_wheeler' | 'three_wheeler' | 'mini_truck' | 'truck'

export interface FareBreakdown {
  base_fare: string
  distance_charge: string
  weight_charge: string
  minimum_fare_adjustment: string
}

export interface FareOption {
  vehicle_type: VehicleType
  available: boolean
  unavailable_reason: string | null
  max_weight_kg: string
  amount: string
  currency: string
  breakdown: FareBreakdown
}

export interface FareEstimate {
  is_estimate: true
  straight_line_km: string
  distance_km: string
  weight_kg: string
  options: FareOption[]
}

export interface EstimatePayload {
  pickup: { latitude: number; longitude: number }
  drop: { latitude: number; longitude: number }
  weight_kg?: number
}

export interface TripEnds {
  pickup: LatLng | null
  drop: LatLng | null
}
