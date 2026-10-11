import { useFareEstimate } from '../hooks/useFareEstimate'
import type { TripEnds } from '../types'
import { cheapestAvailable, formatMoney, vehicleLabel } from '../utils'

import './Pricing.css'

/** "From ₹97 on a two wheeler" — the home page's price, before any sign-in. */
export function FareTeaser({ trip }: { trip: TripEnds }) {
  const { estimate } = useFareEstimate(trip)
  const cheapest = estimate ? cheapestAvailable(estimate.options) : null

  if (!cheapest) return null

  return (
    <p className="fare-teaser" aria-live="polite">
      From <strong>{formatMoney(cheapest.amount, cheapest.currency)}</strong> on a{' '}
      {vehicleLabel(cheapest.vehicle_type).toLowerCase()}
    </p>
  )
}
