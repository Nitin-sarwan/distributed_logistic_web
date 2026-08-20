import type { LatLng } from '@/components/Map'

import type { CreateAddressPayload } from './types'
import type { AddressFormValues } from './validation'

export function toLatLng(latitude: string, longitude: string): LatLng | null {
  if (!latitude || !longitude) return null

  const lat = Number(latitude)
  const lng = Number(longitude)

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null

  return { latitude: lat, longitude: lng }
}

export function toPayload(values: AddressFormValues): CreateAddressPayload {
  return {
    address_line1: values.address_line1.trim(),
    address_line2: values.address_line2?.trim() || null,
    city: values.city.trim(),
    pin_code: values.pin_code.trim(),
    latitude: Number(values.latitude),
    longitude: Number(values.longitude),
  }
}
