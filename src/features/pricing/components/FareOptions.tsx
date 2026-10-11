import { Alert } from '@/components/Alert'
import { cx } from '@/utils'

import type { FareEstimate, VehicleType } from '../types'
import { formatMoney, vehicleLabel } from '../utils'

import './Pricing.css'

export interface FareOptionsProps {
  estimate: FareEstimate | null
  isLoading: boolean
  error: string | null
  selected: VehicleType
  onSelect: (type: VehicleType) => void
}

/** The vehicle picker, with each vehicle's price on it. */
export function FareOptions({ estimate, isLoading, error, selected, onSelect }: FareOptionsProps) {
  if (!estimate) {
    return error ? (
      <Alert tone="error">{error}</Alert>
    ) : (
      <p className="fare-options__status">Working out prices…</p>
    )
  }

  const chosen = estimate.options.find((option) => option.vehicle_type === selected)

  return (
    <fieldset className={cx('fare-options', isLoading && 'fare-options--stale')}>
      <legend className="field__label">Vehicle</legend>

      <div className="fare-options__grid" role="radiogroup">
        {estimate.options.map((option) => (
          <label
            key={option.vehicle_type}
            className={cx(
              'fare-option',
              option.vehicle_type === selected && 'fare-option--selected',
              !option.available && 'fare-option--unavailable',
            )}
          >
            <input
              type="radio"
              name="vehicle-type"
              className="fare-option__input"
              value={option.vehicle_type}
              checked={option.vehicle_type === selected}
              onChange={() => onSelect(option.vehicle_type)}
            />
            <span className="fare-option__name">{vehicleLabel(option.vehicle_type)}</span>
            <span className="fare-option__price">
              {formatMoney(option.amount, option.currency)}
            </span>
            <span className="fare-option__meta">
              {option.available
                ? `Up to ${Number(option.max_weight_kg)} kg`
                : option.unavailable_reason}
            </span>
          </label>
        ))}
      </div>

      {chosen && chosen.available && (
        <dl className="fare-breakdown">
          <div>
            <dt>Base fare</dt>
            <dd>{formatMoney(chosen.breakdown.base_fare, chosen.currency)}</dd>
          </div>
          <div>
            <dt>Distance · {Number(estimate.distance_km)} km</dt>
            <dd>{formatMoney(chosen.breakdown.distance_charge, chosen.currency)}</dd>
          </div>
          {Number(chosen.breakdown.weight_charge) > 0 && (
            <div>
              <dt>Extra weight</dt>
              <dd>{formatMoney(chosen.breakdown.weight_charge, chosen.currency)}</dd>
            </div>
          )}
          {Number(chosen.breakdown.minimum_fare_adjustment) > 0 && (
            <div>
              <dt>Minimum fare</dt>
              <dd>{formatMoney(chosen.breakdown.minimum_fare_adjustment, chosen.currency)}</dd>
            </div>
          )}
        </dl>
      )}

      <p className="fare-options__note">
        Estimate. Distance is the road estimate for a {Number(estimate.straight_line_km)} km
        straight line; the price is fixed when you book.
      </p>

      {error && <Alert tone="error">{error}</Alert>}
    </fieldset>
  )
}
