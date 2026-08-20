export type PartnerStatus = 'offline' | 'online' | 'on_trip' | 'suspended'

export interface Partner {
  id: number
  name: string
  phone: string
  email: string | null
  status: PartnerStatus
  is_verified: boolean
  current_latitude: number | null
  current_longitude: number | null
  location_updated_at: string | null
  rating: number
  rating_count: number
  created_at: string
  updated_at: string | null
}

export interface PartnerLoginPayload {
  phone: string
  password: string
}

export interface PartnerRegisterPayload {
  name: string
  phone: string
  password: string
  email?: string
}

export interface PartnerUpdatePayload {
  name?: string
  email?: string | null
}

export interface PartnerChangePasswordPayload {
  current_password: string
  new_password: string
}

export interface LocationPayload {
  latitude: number
  longitude: number
}

export interface PartnerAuthResponse {
  partner: Partner
  access_token: string
  refresh_token: string
  token_type: string
  expires_at: string
  refresh_expires_at: string
  device_session: string
  device_id: string
}

export interface PartnerAuthState {
  partner: Partner | null
  isAuthenticated: boolean
  isLoading: boolean
}

export type AvailabilityBlock =
  | 'not-verified'
  | 'no-active-vehicle'
  | 'suspended'
  | 'on-trip'
