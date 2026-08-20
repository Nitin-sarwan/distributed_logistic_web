import { Alert } from '@/components/Alert'

import type { usePartnerLocation } from '../hooks/usePartnerLocation'

export interface StaleLocationAlertProps {
  location: ReturnType<typeof usePartnerLocation>
  disabled: boolean
}

export function StaleLocationAlert({ location, disabled }: StaleLocationAlertProps) {
  return (
    <Alert tone="warning">
      <strong>Dispatch cannot see you.</strong>{' '}
      {location.freshness === 'never'
        ? 'We have not received your location yet.'
        : `Your last location was ${location.freshness}.`}{' '}
      Deliveries are only offered to partners we can locate.{' '}
      <button
        type="button"
        className="availability__link-btn"
        onClick={() => void location.share()}
        disabled={disabled || location.isSharing}
      >
        Share location now
      </button>
      {location.wasDenied && (
        <>
          {' '}
          Your browser did not provide a position — allow location access for this
          site and try again.
        </>
      )}
    </Alert>
  )
}
