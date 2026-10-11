import { Card } from '@/components/Card'

import { isTrackable } from '../hooks/useOrderTracking'
import type { Order, OrderTracking } from '../types'

import './Orders.css'

function ageText(updatedAt: string | null): string | null {
  if (!updatedAt) return null
  const seconds = Math.max(0, Math.round((Date.now() - new Date(updatedAt).getTime()) / 1000))
  return seconds < 60 ? `${seconds}s ago` : `${Math.round(seconds / 60)} min ago`
}

/** "About 1.2 km from the pickup · updated 20s ago", or why there is no pin. */
function trackingLine(tracking: OrderTracking | null | undefined): string | null {
  if (!tracking) return null
  if (!tracking.available) {
    return tracking.reason === 'no_position' ? 'Waiting for their location…' : null
  }

  const target = tracking.heading_to === 'drop' ? 'the drop' : 'the pickup'
  const distance =
    tracking.distance_km !== null
      ? `about ${tracking.distance_km.toFixed(1)} km from ${target}`
      : null
  const age = ageText(tracking.updated_at)

  if (tracking.is_stale) {
    return [`Last seen ${age ?? 'a while ago'}`, distance].filter(Boolean).join(' · ')
  }
  const text = [distance, age && `updated ${age}`].filter(Boolean).join(' · ')
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export interface PartnerPanelProps {
  order: Order
  tracking?: OrderTracking | null
}

export function PartnerPanel({ order, tracking }: PartnerPanelProps) {
  if (!order.partner_id) return null

  // After delivery or cancellation the driver is no longer on this order: keep
  // who it was, drop the live line and the phone number.
  const active = isTrackable(order.status)
  const live = active ? trackingLine(tracking) : null
  const note =
    order.status === 'cancelled' ? 'Released when this order was cancelled' : null

  return (
    <Card title="Your delivery partner">
      <div className="order-partner">
        <div>
          <p className="order-partner__name">{order.partner_name}</p>
          <p className="order-partner__meta">{order.vehicle_number}</p>
          {note && <p className="order-partner__note">{note}</p>}
          {live && (
            <p
              className={
                tracking?.is_stale
                  ? 'order-partner__live order-partner__live--stale'
                  : 'order-partner__live'
              }
            >
              {live}
            </p>
          )}
        </div>
        {active && order.partner_phone && (
          <a className="order-partner__call" href={`tel:${order.partner_phone}`}>
            Call
          </a>
        )}
      </div>
    </Card>
  )
}
