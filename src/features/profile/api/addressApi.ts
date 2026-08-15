import { API_ROUTES } from '@/constants'
import { del, get, post, patch } from '@/services'

import type { Address, CreateAddressPayload, UpdateAddressPayload } from '../types'

/**
 * Saved addresses, owned by the User Service.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * The backend has the `address` table and its SQLAlchemy model, but no routes
 * are wired to them yet — USER_SERVICE.md lists this under "Not implemented".
 *
 * These functions target the conventional REST shape for that table. The
 * contract they expect, all requiring a session:
 *
 *   GET    /api/users/addresses        -> Address[]
 *   POST   /api/users/addresses        -> Address        (201)
 *   PATCH  /api/users/addresses/{id}   -> Address
 *   DELETE /api/users/addresses/{id}   -> 204
 *
 * `user_id` comes from the authenticated session, never from the request body —
 * accepting it from the client would let anyone write an address onto someone
 * else's account.
 *
 * Until those routes exist the gateway answers 404, which `useAddresses`
 * detects and renders as an explicit "not available yet" state rather than a
 * misleading error. The UI is complete and switches on the moment the endpoints
 * land; nothing here needs to change.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Normalise coordinates.
 *
 * Postgres `NUMERIC` is commonly serialised as a string to avoid the precision
 * loss of a float round-trip, so the field can arrive either way depending on
 * how the backend serialises `Decimal`. Coercing here means components can rely
 * on `number` and no `.toFixed()` call blows up on a string.
 */
function normalise(address: Address): Address {
  return {
    ...address,
    latitude: Number(address.latitude),
    longitude: Number(address.longitude),
  }
}

/** Every address saved by the signed-in user. */
export async function getAddresses(): Promise<Address[]> {
  const addresses = await get<Address[]>(API_ROUTES.profile.addresses)
  // Defensive: a paginated or wrapped response would otherwise crash .map.
  return Array.isArray(addresses) ? addresses.map(normalise) : []
}

/** Save a new address. */
export async function createAddress(payload: CreateAddressPayload): Promise<Address> {
  const address = await post<Address>(API_ROUTES.profile.addresses, payload)
  return normalise(address)
}

/** Update an existing address. Reserved for the edit flow. */
export async function updateAddress(
  id: number,
  payload: UpdateAddressPayload,
): Promise<Address> {
  const address = await patch<Address>(API_ROUTES.profile.address(id), payload)
  return normalise(address)
}

/** Delete an address. */
export async function deleteAddress(id: number): Promise<void> {
  await del<void>(API_ROUTES.profile.address(id))
}
