import { Card } from '@/components/Card'

import { DeliveryList } from '../components/DeliveryList'
import { usePartner } from '../hooks/usePartner'

import '../components/PartnerUI.css'

export function PartnerDeliveries() {
  const { partner } = usePartner()

  if (!partner) return null

  return (
    <div className="partner-page partner-stack">
      <div>
        <h1 className="partner-page__title">Deliveries</h1>
        <p className="partner-page__subtitle">
          Work assigned to you, from pickup through to drop-off.
        </p>
      </div>

      <Card
        title="In progress"
        description="Mark each step as you go — the customer sees it immediately."
      >
        <DeliveryList
          emptyTitle="Nothing assigned right now"
          emptyDescription="Go online and keep your location fresh. New deliveries appear here as dispatch assigns them."
        />
      </Card>

      <Card title="Completed">
        <DeliveryList
          completed
          emptyTitle="No completed deliveries yet"
          emptyDescription="Deliveries you have handed over will be listed here."
        />
      </Card>
    </div>
  )
}
