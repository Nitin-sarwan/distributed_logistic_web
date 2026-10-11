import { Alert } from '@/components/Alert'
import { Button } from '@/components/Button'
import { formatMoney, vehicleLabel } from '@/features/pricing'

import type { UseCurrentOfferResult } from '../hooks/useCurrentOffer'

import './OfferPanel.css'

function km(value: string | null): string {
  return value === null ? '—' : `${Number(value).toFixed(1)} km`
}

/** The job on offer, with a countdown. Renders nothing when there is none. */
export function OfferPanel({
  offer,
  secondsLeft,
  fractionLeft,
  isResponding,
  notice,
  accept,
  decline,
  dismissNotice,
}: UseCurrentOfferResult) {
  if (!offer) {
    if (!notice) return null
    return (
      <div className="offer-notice">
        <Alert tone={notice.tone}>{notice.text}</Alert>
        <button type="button" className="offer-notice__dismiss" onClick={dismissNotice}>
          Dismiss
        </button>
      </div>
    )
  }

  const urgent = secondsLeft <= 10

  return (
    <section className="offer" role="alertdialog" aria-labelledby="offer-title" aria-live="assertive">
      <div
        className={urgent ? 'offer__timer offer__timer--urgent' : 'offer__timer'}
        style={{ transform: `scaleX(${fractionLeft})` }}
        aria-hidden="true"
      />

      <header className="offer__header">
        <div>
          <p className="offer__eyebrow">New delivery · {offer.public_ref}</p>
          <h2 id="offer-title" className="offer__title">
            {offer.pickup_city || 'Pickup'} → {offer.drop_city || 'Drop'}
          </h2>
        </div>
        <p className={urgent ? 'offer__seconds offer__seconds--urgent' : 'offer__seconds'}>
          <span>{secondsLeft}</span>s
          <span className="sr-only"> left to answer</span>
        </p>
      </header>

      <dl className="offer__facts">
        <div>
          <dt>Fare</dt>
          <dd className="offer__amount">
            {offer.amount ? formatMoney(offer.amount, offer.currency) : '—'}
          </dd>
        </div>
        <div>
          <dt>To pickup</dt>
          <dd>{km(offer.pickup_distance_km)}</dd>
        </div>
        <div>
          <dt>Trip</dt>
          <dd>{km(offer.trip_distance_km)}</dd>
        </div>
        <div>
          <dt>Load</dt>
          <dd>
            {Number(offer.package_weight_kg)} kg · {vehicleLabel(offer.vehicle_type)}
          </dd>
        </div>
      </dl>

      {notice && <Alert tone={notice.tone}>{notice.text}</Alert>}

      <div className="offer__actions">
        <Button variant="secondary" onClick={() => void decline()} disabled={isResponding}>
          Decline
        </Button>
        <Button
          size="lg"
          onClick={() => void accept()}
          isLoading={isResponding}
          loadingText="Claiming…"
        >
          Accept delivery
        </Button>
      </div>
    </section>
  )
}
