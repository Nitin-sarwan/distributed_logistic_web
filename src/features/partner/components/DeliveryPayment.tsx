import { useState } from 'react'

import { Alert } from '@/components/Alert'
import { Button } from '@/components/Button'
import { formatFare, type Order } from '@/features/orders'

import { useDeliveryPayment } from '../hooks/useDeliveryPayment'
import { UpiQrModal } from './UpiQrModal'

const VIA_TEXT = { cash: 'in cash', upi: 'by UPI' } as const

/**
 * Whether to take money at the door, and the two ways to record that it was.
 *
 * Prepaid orders say "don't collect", so a driver never charges twice. Pay-on-
 * delivery orders show the amount from the moment the job is accepted, and the
 * Cash / UPI buttons once the parcel is in hand.
 */
export function DeliveryPayment({ delivery }: { delivery: Order }) {
  const payment = useDeliveryPayment(delivery.id)
  const [confirmingCash, setConfirmingCash] = useState(false)

  const amount = formatFare(delivery)
  const paid = delivery.payment_status === 'paid' || payment.collectedVia !== null
  const inHand = ['picked_up', 'in_transit', 'delivered'].includes(delivery.status)

  if (delivery.payment_method === 'online') {
    return (
      <p className="delivery-pay delivery-pay--paid">
        <strong>Paid online</strong> · don&apos;t collect anything
      </p>
    )
  }

  if (paid) {
    return (
      <p className="delivery-pay delivery-pay--paid">
        <strong>{amount} collected</strong>
        {payment.collectedVia ? ` ${VIA_TEXT[payment.collectedVia]}` : ''}
      </p>
    )
  }

  if (!inHand) {
    return (
      <p className="delivery-pay delivery-pay--due">
        <strong>Collect {amount}</strong> at drop-off · cash or UPI
      </p>
    )
  }

  return (
    <div className="delivery-pay delivery-pay--due delivery-pay--action">
      <p>
        <strong>Collect {amount}</strong> from the customer
      </p>

      {payment.error && <Alert tone="error">{payment.error}</Alert>}

      {confirmingCash ? (
        <div className="delivery-pay__buttons">
          <span className="delivery-pay__question">Received {amount} in cash?</span>
          <Button variant="secondary" size="sm" onClick={() => setConfirmingCash(false)}>
            No
          </Button>
          <Button
            size="sm"
            onClick={() => void payment.collect('cash')}
            isLoading={payment.isBusy}
            loadingText="Recording…"
          >
            Yes, received
          </Button>
        </div>
      ) : (
        <div className="delivery-pay__buttons">
          <Button variant="secondary" size="sm" onClick={() => setConfirmingCash(true)}>
            Cash received
          </Button>
          <Button
            size="sm"
            onClick={() => void payment.openUpi()}
            isLoading={payment.isBusy}
            loadingText="Preparing…"
          >
            Show UPI QR
          </Button>
        </div>
      )}

      <UpiQrModal
        request={payment.upi}
        isBusy={payment.isBusy}
        onPaid={() => void payment.collect('upi')}
        onClose={payment.closeUpi}
      />
    </div>
  )
}
