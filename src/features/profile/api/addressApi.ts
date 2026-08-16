import { API_ROUTES } from '@/constants'
import { del, get, post, patch } from '@/services'

import type { Address, CreateAddressPayload, UpdateAddressPayload } from '../types'

/**
 * Saved addresses, owned by the User Service.
 *
 *   GET    /api/users/addresses        -> Address[]
 *   POST   /api/users/addresses        -> Address   (201)
 *   PATCH  /api/users/addresses/{id}   -> Address
 *   DELETE /api/users/addresses/{id}   -> 204
 *
 * All four require a session. `user_id` is never sent: the backend takes the
 * owner from the session and scopes its queries by it, so a request cannot
 * read or modify another account's addresses whatever it puts in the URL.
 *
 * `useAddresses` still treats a 404 on the list as "not available yet" rather
 * than an error. That path is no longer the normal case, but it keeps the
 * screen honest when pointed at a backend that predates these routes or has
 * not had the address migration applied.
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
