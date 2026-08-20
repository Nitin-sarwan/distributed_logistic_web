import { API_ROUTES } from '@/constants'
import { del, get, post, patch } from '@/services'

import type { Address, CreateAddressPayload, UpdateAddressPayload } from '../types'

function normalise(address: Address): Address {
  return {
    ...address,
    latitude: Number(address.latitude),
    longitude: Number(address.longitude),
  }
}

export async function getAddresses(): Promise<Address[]> {
  const addresses = await get<Address[]>(API_ROUTES.profile.addresses)

  return Array.isArray(addresses) ? addresses.map(normalise) : []
}

export async function createAddress(payload: CreateAddressPayload): Promise<Address> {
  const address = await post<Address>(API_ROUTES.profile.addresses, payload)
  return normalise(address)
}

export async function updateAddress(
  id: number,
  payload: UpdateAddressPayload,
): Promise<Address> {
  const address = await patch<Address>(API_ROUTES.profile.address(id), payload)
  return normalise(address)
}

export async function deleteAddress(id: number): Promise<void> {
  await del<void>(API_ROUTES.profile.address(id))
}
