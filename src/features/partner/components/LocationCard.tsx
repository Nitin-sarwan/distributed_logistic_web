import { Alert } from '@/components/Alert'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { EmptyState } from '@/components/EmptyState'
import { MapView } from '@/components/Map'
import { formatCoordinates } from '@/features/geo'

import { usePartnerLocation } from '../hooks/usePartnerLocation'
import { usePartner } from '../hooks/usePartner'

import './PartnerUI.css'

export function LocationCard() {
  const { partner } = usePartner()
  const location = usePartnerLocation()

  if (!partner) return null

  const shareButton = (
    <Button
      onClick={() => void location.share()}
      isLoading={location.isSharing}
      loadingText="Sending…"
    >
      Share my location
    </Button>
  )

  return (
    <Card
      title="Your position"
      description="What Dispatch sees when it looks for a partner near a pickup."
      action={
        <Button
          variant="secondary"
          size="sm"
          onClick={() => void location.share()}
          isLoading={location.isSharing}
          loadingText="Sending…"
        >
          Update now
        </Button>
      }
    >
      {location.error && <Alert tone="error">{location.error}</Alert>}

      {location.wasDenied && (
        <Alert tone="warning">
          Your browser did not provide a position. Allow location access for this
          site — without it you stay invisible to Dispatch however green your
          status says you are.
        </Alert>
      )}

      {location.position ? (
        <>
          <MapView
            center={location.position}
            markers={location.markers}
            zoom={15}
            height={220}
            ariaLabel="Map showing your last known position"
          />

          <p className="partner-location__meta">
            <span className={location.isStale ? 'partner-location__stale' : undefined}>
              Last sent {location.freshness}
            </span>
            <span className="partner-location__coords">
              {formatCoordinates(location.position)}
            </span>
          </p>

          {location.isInvisibleToDispatch && (
            <Alert tone="warning">
              <strong>This is where Dispatch thinks you are.</strong> It is older
              than {location.staleAfterMinutes} minutes, which means you are being
              skipped for deliveries. Update it, or check that this site still has
              location access.
            </Alert>
          )}
        </>
      ) : (
        <EmptyState
          title="No position sent yet"
          description="Share your location so Dispatch can offer you deliveries near you. It is sent only while you are online."
          action={shareButton}
        />
      )}
    </Card>
  )
}
