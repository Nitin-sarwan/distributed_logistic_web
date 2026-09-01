import { formatDistance } from '@/features/geo'

import type { Order } from '../types'
import { formatFare } from '../utils'

import './Orders.css'

export function OrderSummary({ order }: { order: Order }) {
  return (
    <dl className="order-facts">
      <div>
        <dt>Fare</dt>
        <dd className="order-facts__fare">{formatFare(order)}</dd>
      </div>
      <div>
        <dt>Distance</dt>
        <dd>{order.distance_km !== null ? formatDistance(order.distance_km) : '—'}</dd>
      </div>
      <div>
        <dt>Vehicle</dt>
        <dd>{order.vehicle_type.replace(/_/g, ' ')}</dd>
      </div>
      <div>
        <dt>Weight</dt>
        <dd>{order.package_weight_kg} kg</dd>
      </div>
    </dl>
  )
}
