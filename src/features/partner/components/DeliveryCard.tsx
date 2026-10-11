import { Button } from '@/components/Button'
import { OrderStatusPill, formatFare, type Order } from '@/features/orders'
import { formatPhone } from '@/utils'

import { DeliveryPayment } from './DeliveryPayment'

import './PartnerUI.css'

export interface DeliveryCardProps {
  delivery: Order
  isBusy: boolean
  onPickUp: (id: number) => void
  onDeliver: (id: number) => void
}

export function DeliveryCard({ delivery, isBusy, onPickUp, onDeliver }: DeliveryCardProps) {
  const awaitingPickup = delivery.status === 'partner_assigned'
  const inHand = delivery.status === 'picked_up' || delivery.status === 'in_transit'
  const contact = inHand ? delivery.drop : delivery.pickup

  return (
    <article className="delivery">
      <header className="delivery__header">
        <span className="delivery__ref">{delivery.public_ref}</span>
        <OrderStatusPill status={delivery.status} />
      </header>

      <div className="delivery__legs">
        <div className={awaitingPickup ? 'delivery__leg delivery__leg--next' : 'delivery__leg'}>
          <p className="delivery__leg-label">Pickup</p>
          <p className="delivery__leg-value">{delivery.pickup.line1}</p>
          <p className="delivery__leg-meta">{delivery.pickup.city}</p>
        </div>

        <div className={inHand ? 'delivery__leg delivery__leg--next' : 'delivery__leg'}>
          <p className="delivery__leg-label">Drop</p>
          <p className="delivery__leg-value">{delivery.drop.line1}</p>
          <p className="delivery__leg-meta">{delivery.drop.city}</p>
        </div>
      </div>

      <dl className="delivery__facts">
        <div>
          <dt>Fare</dt>
          <dd>{formatFare(delivery)}</dd>
        </div>
        <div>
          <dt>Weight</dt>
          <dd>{delivery.package_weight_kg} kg</dd>
        </div>
        <div>
          <dt>{inHand ? 'Recipient' : 'Sender'}</dt>
          <dd>{contact.contact_name}</dd>
        </div>
      </dl>

      {delivery.package_description && (
        <p className="delivery__note">{delivery.package_description}</p>
      )}

      <DeliveryPayment delivery={delivery} />

      <div className="delivery__actions">
        <a className="delivery__call" href={`tel:${contact.contact_phone}`}>
          Call {formatPhone(contact.contact_phone)}
        </a>

        {awaitingPickup && (
          <Button
            onClick={() => onPickUp(delivery.id)}
            isLoading={isBusy}
            loadingText="Saving…"
          >
            Mark picked up
          </Button>
        )}

        {inHand && (
          <Button
            onClick={() => onDeliver(delivery.id)}
            isLoading={isBusy}
            loadingText="Saving…"
          >
            Mark delivered
          </Button>
        )}
      </div>
    </article>
  )
}
