import { API_ROUTES } from '@/constants'
import { clearSessionToken, post } from '@/services'
import type { DetailResponse } from '@/types'

import type { ChangePasswordPayload, ResetPasswordPayload } from '../types'

export async function changePassword(payload: ChangePasswordPayload): Promise<string> {
  const response = await post<DetailResponse>(API_ROUTES.auth.changePassword, payload)
  clearSessionToken()
  return response.detail
}

export async function forgotPassword(email: string): Promise<{ resetToken?: string }> {
  const response = await post<DetailResponse & { reset_token?: string }>(
    API_ROUTES.auth.forgotPassword,
    { email },
  )
  return response.reset_token ? { resetToken: response.reset_token } : {}
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<string> {
  const response = await post<DetailResponse>(API_ROUTES.auth.resetPassword, payload)
  clearSessionToken()
  return response.detail
}
