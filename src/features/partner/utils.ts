import { STALE_AFTER_MINUTES } from './constants'
import type { AvailabilityBlock, Partner, Vehicle } from './types'

export function minutesSince(iso: string | null): number | null {
  if (!iso) return null
  return Math.floor((Date.now() - new Date(iso).getTime()) / 60_000)
}

export function describeFreshness(minutes: number | null): string {
  if (minutes === null) return 'never'
  if (minutes < 1) return 'just now'
  return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
}

export function isLocationStale(partner: Partner): boolean {
  const minutes = minutesSince(partner.location_updated_at)
  return minutes === null || minutes >= STALE_AFTER_MINUTES
}

export function availabilityBlock(
  partner: Partner,
  activeVehicle: Vehicle | null,
): AvailabilityBlock | null {
  if (partner.status === 'suspended') return 'suspended'
  if (partner.status === 'on_trip') return 'on-trip'
  if (!partner.is_verified) return 'not-verified'
  if (!activeVehicle) return 'no-active-vehicle'
  return null
}
