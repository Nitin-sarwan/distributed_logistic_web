import { Alert } from '@/components/Alert'
import { Card } from '@/components/Card'
import { EmptyState } from '@/components/EmptyState'

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

      <Alert tone="info">
        <strong>Deliveries are not live yet.</strong> Assigning work needs the dispatch
        service, which is still being built. Your availability and vehicle details are
        already being recorded, so you will start receiving deliveries as soon as it is
        switched on.
      </Alert>

      <Card title="Assigned to you">
        <EmptyState
          title="No deliveries"
          description={
            partner.status === 'online'
              ? 'You are online. Anything assigned to you will appear here.'
              : partner.status === 'on_trip'
                ? 'You are marked as on a delivery. Details will appear here once dispatch is live.'
                : 'Go online from the dashboard to start receiving deliveries.'
          }
        />
      </Card>
    </div>
  )
}
