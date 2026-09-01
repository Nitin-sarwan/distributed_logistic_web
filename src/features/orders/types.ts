export type OrderStatus =
  | 'created'
  | 'quoted'
  | 'payment_pending'
  | 'confirmed'
  | 'searching_partner'
  | 'partner_assigned'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'settled'
  | 'cancelled'

export interface AddressSnapshot {
  line1: string
  line2: string | null
  city: string
  pin_code: string
  latitude: number
  longitude: number
  contact_name: string
  contact_phone: string
}

export interface Order {
  id: number
  public_ref: string
  status: OrderStatus
  pickup: AddressSnapshot
  drop: AddressSnapshot
  vehicle_type: string
  package_weight_kg: number
  package_description: string | null
  distance_km: number | null
  quoted_amount: string | null
  currency: string
  quote_expires_at: string | null
  partner_id: number | null
  partner_name: string | null
  partner_phone: string | null
  vehicle_number: string | null
  created_at: string
  confirmed_at: string | null
  picked_up_at: string | null
  delivered_at: string | null
  cancelled_at: string | null
  cancellation_reason: string | null
}

export interface OrderStatusEntry {
  from_status: string | null
  to_status: OrderStatus
  actor: string
  occurred_at: string
}

export interface AddressPayload {
  address_line1: string
  address_line2?: string | null
  city: string
  pin_code: string
  latitude: number
  longitude: number
  contact_name: string
  contact_phone: string
}

export type OrderEndpointPayload =
  | { address_id: number }
  | { address: AddressPayload }

export interface CreateOrderPayload {
  pickup: OrderEndpointPayload
  drop: OrderEndpointPayload
  vehicle_type: string
  weight_kg: number
  description?: string | null
}
