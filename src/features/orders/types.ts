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

/** Paid up front, or to the driver at drop-off. */
export type PaymentMethod = 'online' | 'on_delivery'

export type PaymentStatus = 'pending' | 'paid' | 'refunded'

export interface AddressSnapshot {
  line1: string
  line2: string | null
  city: string
  pin_code: string | null
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
  payment_method: PaymentMethod
  payment_status: PaymentStatus
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

export interface OrderTracking {
  available: boolean
  /** Why there is no position: not_assigned | finished | no_position | unavailable */
  reason: string | null
  latitude: number | null
  longitude: number | null
  updated_at: string | null
  /** The driver has not reported for a few minutes: show "last seen", not live. */
  is_stale: boolean
  heading_to: 'pickup' | 'drop' | null
  /** Straight line to heading_to, so approximate. */
  distance_km: number | null
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
  pin_code: string | null
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
  payment_method: PaymentMethod
  description?: string | null
}
