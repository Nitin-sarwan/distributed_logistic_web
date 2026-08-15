/**
 * A saved address, mirroring the `address` table in the User Service.
 *
 * Coordinates are `NUMERIC(9,6)` in Postgres and arrive as numbers here. They
 * are non-null in the schema, which is deliberate for a logistics platform: a
 * pickup or drop point has to resolve to an actual location on a map, not just
 * a line of text a driver has to interpret.
 */
export interface Address {
  id: number
  user_id: number
  address_line1: string
  address_line2: string | null
  city: string
  pin_code: string
  latitude: number
  longitude: number
}

/** Body for creating an address. The backend derives `user_id` from the session. */
export interface CreateAddressPayload {
  address_line1: string
  address_line2?: string | null
  city: string
  pin_code: string
  latitude: number
  longitude: number
}

/** Partial update. Reserved for the edit flow, which comes after list/add/delete. */
export type UpdateAddressPayload = Partial<CreateAddressPayload>

/**
 * Why the address list is unavailable.
 *
 * `not-implemented` is its own case on purpose: the `address` table and model
 * exist in the User Service but no routes are wired to them yet
 * (USER_SERVICE.md, "Not implemented"). Showing "something went wrong" for a
 * feature the backend simply has not built would send someone debugging the
 * wrong layer.
 */
export type AddressUnavailableReason = 'not-implemented' | 'error'
