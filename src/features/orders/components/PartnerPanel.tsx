import { Card } from '@/components/Card'

import type { Order } from '../types'

import './Orders.css'

export function PartnerPanel({ order }: { order: Order }) {
  if (!order.partner_id) return null

  return (
    <Card title="Your delivery partner">
      <div className="order-partner">
        <div>
          <p className="order-partner__name">{order.partner_name}</p>
          <p className="order-partner__meta">{order.vehicle_number}</p>
        </div>
        {order.partner_phone && (
          <a className="order-partner__call" href={`tel:${order.partner_phone}`}>
            Call
          </a>
        )}
      </div>
    </Card>
  )
}
