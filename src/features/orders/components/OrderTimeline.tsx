import { cx } from '@/utils'

import type { OrderStatusEntry } from '../types'
import { statusLabel, statusTone } from '../utils'

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
      {entries.map((entry, index) => {
        const isCurrent = index === entries.length - 1
        // Earlier steps are done. The latest one takes the order's own tone:
        // green when delivered, red when cancelled, blue while still moving.
        const tone = isCurrent ? statusTone(entry.to_status) : 'done'

        return (
          <li
            key={`${entry.to_status}-${entry.occurred_at}`}
            className={cx(
              'order-timeline__item',
              `order-timeline__item--${tone}`,
              isCurrent && 'order-timeline__item--current',
            )}
            aria-current={isCurrent ? 'step' : undefined}
          >
            <span className="order-timeline__dot" aria-hidden="true" />
            <div>
              <p className="order-timeline__label">{statusLabel(entry.to_status)}</p>
              <p className="order-timeline__meta">
                {TIME.format(new Date(entry.occurred_at))} · {entry.actor}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
