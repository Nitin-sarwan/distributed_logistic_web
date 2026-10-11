import { API_ROUTES } from '@/constants'
import { get, post } from '@/services'

export type CollectedVia = 'online' | 'cash' | 'upi'

export interface DeliveryPayment {
  order_id: number
  public_ref: string
  method: 'online' | 'on_delivery'
  status: 'awaiting' | 'paid' | 'refunded' | 'voided'
  amount: string
  currency: string
  collected_via: CollectedVia | null
  paid_at: string | null
}

export interface UpiRequest {
  order_id: number
  public_ref: string
  amount: string
  currency: string
  /** The `upi://pay?...` link the QR encodes. */
  upi_link: string
  payee_vpa: string
  payee_name: string
}

export function getUpiRequest(orderId: number): Promise<UpiRequest> {
  return get<UpiRequest>(API_ROUTES.deliveries.paymentUpi(orderId))
}

export function collectPayment(orderId: number, via: 'cash' | 'upi'): Promise<DeliveryPayment> {
  return post<DeliveryPayment>(API_ROUTES.deliveries.paymentCollect(orderId), { via })
}
