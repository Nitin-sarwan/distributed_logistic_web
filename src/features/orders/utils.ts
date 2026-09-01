import type { Order, OrderStatus } from './types'

const LABELS: Record<OrderStatus, string> = {
  created: 'Created',
  quoted: 'Awaiting confirmation',
  payment_pending: 'Payment pending',
  confirmed: 'Confirmed',
  searching_partner: 'Finding a partner',
  partner_assigned: 'Partner on the way',
  picked_up: 'Picked up',
  in_transit: 'In transit',
  delivered: 'Delivered',
  settled: 'Completed',
  cancelled: 'Cancelled',
}

export type StatusTone = 'neutral' | 'progress' | 'success' | 'danger'

const TONES: Record<OrderStatus, StatusTone> = {
  created: 'neutral',
  quoted: 'neutral',
  payment_pending: 'progress',
  confirmed: 'progress',
  searching_partner: 'progress',
  partner_assigned: 'progress',
  picked_up: 'progress',
  in_transit: 'progress',
  delivered: 'success',
  settled: 'success',
  cancelled: 'danger',
}

const TERMINAL: OrderStatus[] = ['settled', 'cancelled']
const CANCELLABLE: OrderStatus[] = [
  'created',
  'quoted',
  'payment_pending',
  'confirmed',
  'searching_partner',
  'partner_assigned',
]

export const statusLabel = (status: OrderStatus): string => LABELS[status]
export const statusTone = (status: OrderStatus): StatusTone => TONES[status]

export const isLive = (status: OrderStatus): boolean =>
  !TERMINAL.includes(status) && status !== 'delivered'

export const isCancellable = (status: OrderStatus): boolean =>
  CANCELLABLE.includes(status)

export const needsConfirmation = (status: OrderStatus): boolean => status === 'quoted'

export function formatFare(order: Pick<Order, 'quoted_amount' | 'currency'>): string {
  if (!order.quoted_amount) return '—'
  const amount = Number(order.quoted_amount)
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: order.currency,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function shortAddress(snapshot: { line1: string; city: string }): string {
  return [snapshot.line1, snapshot.city].filter(Boolean).join(', ')
}
