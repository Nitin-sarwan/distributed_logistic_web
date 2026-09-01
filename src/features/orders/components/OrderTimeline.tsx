import type { OrderStatusEntry } from '../types'
import { statusLabel } from '../utils'

import './Orders.css'

const TIME = new Intl.DateTimeFormat('en-IN', {
  hour: 'numeric',
  minute: '2-digit',
  day: 'numeric',
  month: 'short',
})

export function OrderTimeline({ entries }: { entries: OrderStatusEntry[] }) {
  if (entries.length === 0) return null

  return (
    <ol className="order-timeline">
      {entries.map((entry, index) => (
        <li
          key={`${entry.to_status}-${entry.occurred_at}`}
          className={
            index === entries.length - 1
              ? 'order-timeline__item order-timeline__item--current'
              : 'order-timeline__item'
          }
        >
          <span className="order-timeline__dot" aria-hidden="true" />
          <div>
            <p className="order-timeline__label">{statusLabel(entry.to_status)}</p>
            <p className="order-timeline__meta">
              {TIME.format(new Date(entry.occurred_at))} · {entry.actor}
            </p>
          </div>
        </li>
      ))}
    </ol>
  )
}
