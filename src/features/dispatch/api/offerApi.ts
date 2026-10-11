import { API_ROUTES } from '@/constants'
import { get, post } from '@/services'

import type { OfferCard, OfferResponse } from '../types'

/** `null` most of the time — "nothing on offer" is a successful poll, not a 404. */
export function getCurrentOffer(): Promise<OfferCard | null> {
  return get<OfferCard | null>(API_ROUTES.dispatch.currentOffer)
}

export function acceptOffer(offerId: number): Promise<OfferResponse> {
  return post<OfferResponse>(API_ROUTES.dispatch.accept(offerId))
}

export function declineOffer(offerId: number, reason?: string): Promise<OfferResponse> {
  return post<OfferResponse>(API_ROUTES.dispatch.decline(offerId), { reason: reason ?? null })
}
