import { API_ROUTES } from '@/constants'
import {
  ApiError,
  get,
  getAllowingUnauthenticated,
  post,
  setSessionToken,
  clearSessionToken,
  mayHaveSession,
} from '@/services'
import type { DetailResponse, User } from '@/types'

import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
} from '../types'

function adoptSession(response: AuthResponse): User {
  setSessionToken(response.access_token)
  return response.user
}

export async function signup(payload: RegisterPayload): Promise<User> {
  return adoptSession(await post<AuthResponse>(API_ROUTES.auth.register, payload))
}

export async function login(payload: LoginPayload): Promise<User> {
  return adoptSession(await post<AuthResponse>(API_ROUTES.auth.login, payload))
}

export async function getCurrentUser(): Promise<User | null> {
  if (!mayHaveSession()) return null

  try {
    return await getAllowingUnauthenticated<User>(API_ROUTES.auth.me)
  } catch (error) {
    if (error instanceof ApiError && error.isUnauthenticated) return null
    throw error
  }
}

export function getProfile(): Promise<User> {
  return get<User>(API_ROUTES.profile.me)
}

export async function logout(): Promise<void> {
  try {
    await post<DetailResponse>(API_ROUTES.auth.logout)
  } finally {
    clearSessionToken()
  }
}

export async function logoutEverywhere(): Promise<number> {
  try {
    const response = await post<DetailResponse & { sessions_revoked: number }>(
      API_ROUTES.auth.logoutAll,
    )
    return response.sessions_revoked
  } finally {
    clearSessionToken()
  }
}
