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

export type VehicleType = 'two_wheeler' | 'three_wheeler' | 'mini_truck' | 'truck'

export const VEHICLE_LABELS: Record<VehicleType, string> = {
  two_wheeler: 'Two wheeler',
  three_wheeler: 'Three wheeler',
  mini_truck: 'Mini truck',
  truck: 'Truck',
}

export const VEHICLE_MAX_KG: Record<VehicleType, number> = {
  two_wheeler: 30,
  three_wheeler: 500,
  mini_truck: 1500,
  truck: 10000,
}

export interface BookingDetails {
  pickup: Place
  drop: Place
  vehicleType: VehicleType
  weightKg: number
  description: string
  dropContactName: string
  dropContactPhone: string
  paymentMethod: 'online' | 'on_delivery'
}

const PIN_PATTERN = /^\d{6}$/

export const isValidPin = (value: string | null | undefined): value is string =>
  !!value && PIN_PATTERN.test(value)
