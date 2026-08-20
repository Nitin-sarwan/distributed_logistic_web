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

export interface CreateAddressPayload {
  address_line1: string
  address_line2?: string | null
  city: string
  pin_code: string
  latitude: number
  longitude: number
}

export type UpdateAddressPayload = Partial<CreateAddressPayload>

export type AddressUnavailableReason = 'not-implemented' | 'error'
