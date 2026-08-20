import { API_ROUTES } from '@/constants'
import { patch, post } from '@/services'

import type {
  LocationPayload,
  Partner,
  PartnerStatus,
  PartnerUpdatePayload,
} from '../types'

export function updateProfile(payload: PartnerUpdatePayload): Promise<Partner> {
  return patch<Partner>(API_ROUTES.partner.me, payload)
}

export function setStatus(status: 'online' | 'offline'): Promise<Partner> {
  return patch<Partner>(API_ROUTES.partner.status, { status } satisfies {
    status: PartnerStatus
  })
}

export function updateLocation(payload: LocationPayload): Promise<Partner> {
  return post<Partner>(API_ROUTES.partner.location, payload)
}
