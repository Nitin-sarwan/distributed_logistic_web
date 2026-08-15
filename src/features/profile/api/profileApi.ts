import { API_ROUTES } from '@/constants'
import { get } from '@/services'
import type { User } from '@/types'

/**
 * The signed-in user's profile.
 *
 * No id in the path: the session already determines identity, so the backend
 * returns whoever the credential belongs to. An endpoint taking a user id would
 * have to authorize it, and that is a check waiting to be forgotten.
 */
export function getProfile(): Promise<User> {
  return get<User>(API_ROUTES.profile.me)
}

/**
 * Editing name and phone is not available: the User Service has no
 * `PATCH /profile` yet — it is listed under "Not implemented", with a note that
 * the endpoint should exist. Password changes are deliberately separate, since
 * they require the current password and revoke every session.
 *
 * When it lands, the function goes here and `useProfile` gains a mutation. No
 * page or component changes.
 */
