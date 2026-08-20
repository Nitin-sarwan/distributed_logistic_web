import { Alert } from '@/components/Alert'
import { Button } from '@/components/Button'

import { useAvailability } from '../hooks/useAvailability'
import { usePartner } from '../hooks/usePartner'
import type { Vehicle } from '../types'
import { AvailabilityBlockAlert } from './AvailabilityBlockAlert'
import { StaleLocationAlert } from './StaleLocationAlert'
import { PartnerStatusPill } from './StatusPill'

export interface AvailabilityToggleProps {
  activeVehicle: Vehicle | null
  isVehiclesLoading?: boolean
}

export function AvailabilityToggle({
  activeVehicle,
  isVehiclesLoading = false,
}: AvailabilityToggleProps) {
  const { partner } = usePartner()
  const { isOnline, block, isBusy, error, toggle, location } = useAvailability({
    activeVehicle,
    isVehiclesLoading,
  })

  if (!partner) return null

  return (
    <section className="availability">
      <header className="availability__header">
        <div>
          <h2 className="availability__title">Availability</h2>
          <p className="availability__hint">
            {isOnline
              ? 'You are visible to dispatch and can receive deliveries.'
              : 'You will not receive any deliveries while you are offline.'}
          </p>
        </div>
        <PartnerStatusPill status={partner.status} />
      </header>

      <div className="availability__state">
        <span
          className={
            isOnline ? 'availability__lamp availability__lamp--on' : 'availability__lamp'
          }
          aria-hidden="true"
        />
        <span className="availability__state-label">
          {isOnline ? 'Online' : partner.status === 'on_trip' ? 'On a delivery' : 'Offline'}
        </span>
      </div>

      {error && <Alert tone="error">{error}</Alert>}

      {block ? (
        <AvailabilityBlockAlert block={block} />
      ) : (
        <Button
          size="lg"
          fullWidth
          variant={isOnline ? 'secondary' : 'primary'}
          onClick={() => void toggle()}
          isLoading={isBusy}
          loadingText={isOnline ? 'Going offline…' : 'Going online…'}
        >
          {isOnline ? 'Go offline' : 'Go online'}
        </Button>
      )}

      {location.isInvisibleToDispatch && (
        <StaleLocationAlert location={location} disabled={isBusy} />
      )}
    </section>
  )
}
