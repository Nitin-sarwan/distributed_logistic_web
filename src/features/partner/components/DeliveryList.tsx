import { Alert } from '@/components/Alert'
import { EmptyState } from '@/components/EmptyState'
import { Loader } from '@/components/Loader'

import { useDeliveries } from '../hooks/useDeliveries'
import { DeliveryCard } from './DeliveryCard'

import './PartnerUI.css'

export interface DeliveryListProps {
  completed?: boolean
  emptyTitle: string
  emptyDescription: string
}

export function DeliveryList({ completed = false, emptyTitle, emptyDescription }: DeliveryListProps) {
  const { deliveries, isLoading, error, unavailable, busyId, pickUp, deliver } =
    useDeliveries(completed)

  if (isLoading) return <Loader label="Loading your deliveries…" />

  if (unavailable) {
    return (
      <Alert tone="info">
        <strong>Deliveries aren&apos;t reachable.</strong> Check that the Order Service
        is running and that the gateway routes <code>/api/deliveries</code>.
      </Alert>
    )
  }

  return (
    <div className="partner-stack">
      {error && <Alert tone="error">{error}</Alert>}

      {deliveries.length === 0 ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        deliveries.map((delivery) => (
          <DeliveryCard
            key={delivery.id}
            delivery={delivery}
            isBusy={busyId === delivery.id}
            onPickUp={pickUp}
            onDeliver={deliver}
          />
        ))
      )}
    </div>
  )
}
