import { API_ROUTES } from '@/constants'
import { get } from '@/services'
import type { User } from '@/types'

export function getProfile(): Promise<User> {
  return get<User>(API_ROUTES.profile.me)
}

