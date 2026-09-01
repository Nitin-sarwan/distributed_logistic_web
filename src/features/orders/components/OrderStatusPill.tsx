import { cx } from '@/utils'

import type { OrderStatus } from '../types'
import { statusLabel, statusTone } from '../utils'

import './Orders.css'

export function OrderStatusPill({ status }: { status: OrderStatus }) {
  return (
    <span className={cx('order-pill', `order-pill--${statusTone(status)}`)}>
      {statusLabel(status)}
    </span>
  )
}
