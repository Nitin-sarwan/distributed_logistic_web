import { API_ROUTES } from '@/constants'
import {
  ApiError,
  clearSessionToken,
  get,
  getAllowingUnauthenticated,
  mayHaveSession,
  post,
} from '@/services'
import type { DetailResponse } from '@/types'

import type {
  Partner,
  PartnerAuthResponse,
  PartnerChangePasswordPayload,
  PartnerLoginPayload,
  PartnerRegisterPayload,
} from '../types'
import { PARTNER_AUDIENCE, adoptSession } from './session'

export async function signup(payload: PartnerRegisterPayload): Promise<Partner> {
  return adoptSession(
    await post<PartnerAuthResponse>(API_ROUTES.partner.register, payload),
  )
}

export async function login(payload: PartnerLoginPayload): Promise<Partner> {
  return adoptSession(await post<PartnerAuthResponse>(API_ROUTES.partner.login, payload))
}

export async function getCurrentPartner(): Promise<Partner | null> {
  if (!mayHaveSession(PARTNER_AUDIENCE)) return null

  try {
    return await getAllowingUnauthenticated<Partner>(API_ROUTES.partner.me)
  } catch (error) {
    if (error instanceof ApiError && error.isUnauthenticated) return null
    throw error
  }
}

export function getProfile(): Promise<Partner> {
  return get<Partner>(API_ROUTES.partner.me)
}

export async function logout(): Promise<void> {
  try {
    await post<DetailResponse>(API_ROUTES.partner.logout)
  } finally {
    clearSessionToken(PARTNER_AUDIENCE)
  }
}

export async function logoutEverywhere(): Promise<number> {
  try {
    const response = await post<DetailResponse & { sessions_revoked: number }>(
      API_ROUTES.partner.logoutAll,
    )
    return response.sessions_revoked
  } finally {
    clearSessionToken(PARTNER_AUDIENCE)
  }
}

export async function changePassword(
  payload: PartnerChangePasswordPayload,
): Promise<string> {
  const response = await post<DetailResponse>(API_ROUTES.partner.changePassword, payload)
  clearSessionToken(PARTNER_AUDIENCE)
  return response.detail
}
