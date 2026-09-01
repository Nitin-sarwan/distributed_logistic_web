import { Link } from 'react-router-dom'

import { orderPath } from '@/constants'
import { formatDate } from '@/utils'

import type { Order } from '../types'
import { formatFare } from '../utils'
import { OrderRoute } from './OrderRoute'
import { OrderStatusPill } from './OrderStatusPill'

import './Orders.css'

export function OrderCard({ order }: { order: Order }) {
  return (
    <li className="order-card">
      <Link className="order-card__link" to={orderPath(order.id)}>
        <div className="order-card__head">
          <span className="order-card__ref">{order.public_ref}</span>
          <OrderStatusPill status={order.status} />
        </div>

        <OrderRoute pickup={order.pickup} drop={order.drop} compact />

        <div className="order-card__foot">
          <span>{formatDate(order.created_at)}</span>
          <span className="order-card__fare">{formatFare(order)}</span>
        </div>
      </Link>
    </li>
  )
}
