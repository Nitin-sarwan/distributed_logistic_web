import { Button } from '@/components/Button'

export type DeliveryStatus =
  | 'assigned'
  | 'accepted'
  | 'arrived_at_pickup'
  | 'picked_up'
  | 'in_transit'
  | 'delivered'
  | 'cancelled'

export interface Delivery {
  id: string
  reference: string
  pickup_address: string
  drop_address: string
  status: DeliveryStatus
}

const STATUS_LABELS: Record<DeliveryStatus, string> = {
  assigned: 'Assigned to you',
  accepted: 'Accepted',
  arrived_at_pickup: 'At pickup',
  picked_up: 'Picked up',
  in_transit: 'In transit',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export interface DeliveryCardProps {
  delivery: Delivery
  onView: (id: string) => void
}

export function DeliveryCard({ delivery, onView }: DeliveryCardProps) {
  return (
    <article className="delivery">
      <header className="delivery__header">
        <span className="delivery__ref">#{delivery.reference}</span>
        <span className="pill pill--busy">
          <span className="pill__dot" aria-hidden="true" />
          {STATUS_LABELS[delivery.status]}
        </span>
      </header>

      <div className="delivery__route">
        <span className="delivery__marker" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
            <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2.4" />
          </svg>
        </span>
        <div>
          <p className="delivery__leg-label">Pickup</p>
          <p className="delivery__leg-value">{delivery.pickup_address}</p>
        </div>

        <span className="delivery__marker" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
            <path
              d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div>
          <p className="delivery__leg-label">Drop</p>
          <p className="delivery__leg-value">{delivery.drop_address}</p>
        </div>
      </div>

      <div className="delivery__actions">
        <Button variant="secondary" size="sm" onClick={() => onView(delivery.id)}>
          View details
        </Button>
      </div>
    </article>
  )
}
