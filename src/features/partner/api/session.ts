import { setSessionToken } from '@/services'

import type { Partner, PartnerAuthResponse } from '../types'

export const PARTNER_AUDIENCE = 'partner' as const

export function adoptSession(response: PartnerAuthResponse): Partner {
  setSessionToken(response.access_token, PARTNER_AUDIENCE)
  return response.partner
}
