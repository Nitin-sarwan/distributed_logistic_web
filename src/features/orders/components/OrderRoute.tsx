import type { AddressSnapshot } from '../types'

import './Orders.css'

export interface OrderRouteProps {
  pickup: AddressSnapshot
  drop: AddressSnapshot
  compact?: boolean
}

export function OrderRoute({ pickup, drop, compact = false }: OrderRouteProps) {
  return (
    <div className="order-route">
      <span className="order-route__rail" aria-hidden="true">
        <span className="order-route__dot order-route__dot--pickup" />
        <span className="order-route__line" />
        <span className="order-route__dot order-route__dot--drop" />
      </span>

      <div className="order-route__ends">
        <div>
          <p className="order-route__line1">{pickup.line1}</p>
          {!compact && (
            <p className="order-route__meta">
              {pickup.city} · {pickup.contact_name} · {pickup.contact_phone}
            </p>
          )}
        </div>
        <div>
          <p className="order-route__line1">{drop.line1}</p>
          {!compact && (
            <p className="order-route__meta">
              {drop.city} · {drop.contact_name} · {drop.contact_phone}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
