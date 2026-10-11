import { formatDistance } from '@/features/geo'

import type { Order } from '../types'
import { formatFare, paymentLabel } from '../utils'

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
      <div>
        <dt>Payment</dt>
        <dd
          className={
            'order-facts__payment ' +
            (order.payment_status === 'paid'
              ? 'order-facts__paid'
              : order.payment_status === 'pending' && order.payment_method === 'on_delivery'
                ? 'order-facts__due'
                : '')
          }
        >
          {paymentLabel(order)}
        </dd>
      </div>
    </dl>
  )
}
