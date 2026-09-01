import { useState, type FormEvent } from 'react'

import { Alert } from '@/components/Alert'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import type { Place } from '@/features/geo'
import type { User } from '@/types'

import { useBookingSubmit } from '../hooks/useBookingSubmit'
import { VEHICLE_LABELS, VEHICLE_MAX_KG, type VehicleType } from '../types'

import './Booking.css'

export interface BookingDetailsFormProps {
  pickup: Place
  drop: Place
  user: User | null
  onCancel: () => void
}

const VEHICLE_TYPES = Object.keys(VEHICLE_LABELS) as VehicleType[]

export function BookingDetailsForm({ pickup, drop, user, onCancel }: BookingDetailsFormProps) {
  const { submit, isSubmitting, error } = useBookingSubmit(user)

  const [vehicleType, setVehicleType] = useState<VehicleType>('two_wheeler')
  const [weightKg, setWeightKg] = useState('5')
  const [description, setDescription] = useState('')
  const [dropContactName, setDropContactName] = useState('')
  const [dropContactPhone, setDropContactPhone] = useState('')

  const weight = Number(weightKg)
  const maxKg = VEHICLE_MAX_KG[vehicleType]
  const weightError =
    weightKg !== '' && (!Number.isFinite(weight) || weight <= 0)
      ? 'Enter the weight in kilograms.'
      : weight > maxKg
        ? `A ${VEHICLE_LABELS[vehicleType].toLowerCase()} carries up to ${maxKg} kg.`
        : undefined

  const phoneError =
    dropContactPhone !== '' && !/^\d{10}$/.test(dropContactPhone)
      ? 'Enter a 10-digit number.'
      : undefined

  const canSubmit = !weightError && !phoneError && weight > 0

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return

    void submit({
      pickup,
      drop,
      vehicleType,
      weightKg: weight,
      description,
      dropContactName,
      dropContactPhone,
    })
  }

  return (
    <form className="booking-details" onSubmit={handleSubmit} noValidate>
      {error && <Alert tone="error">{error}</Alert>}

      <div className="field">
        <label className="field__label" htmlFor="vehicle-type">
          Vehicle
        </label>
        <div className="field__control">
          <select
            id="vehicle-type"
            className="field__input"
            value={vehicleType}
            onChange={(event) => setVehicleType(event.target.value as VehicleType)}
          >
            {VEHICLE_TYPES.map((type) => (
              <option key={type} value={type}>
                {VEHICLE_LABELS[type]} — up to {VEHICLE_MAX_KG[type]} kg
              </option>
            ))}
          </select>
        </div>
      </div>

      <Input
        label="Package weight (kg)"
        type="number"
        inputMode="decimal"
        min={1}
        step="any"
        value={weightKg}
        onChange={(event) => setWeightKg(event.target.value)}
        error={weightError}
      />

      <Input
        label="What is being sent? (optional)"
        placeholder="Documents, spare parts, a cake"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />

      <div className="booking-details__row">
        <Input
          label="Who receives it? (optional)"
          placeholder={user?.name ?? 'Recipient name'}
          value={dropContactName}
          onChange={(event) => setDropContactName(event.target.value)}
        />
        <Input
          label="Their phone (optional)"
          inputMode="numeric"
          maxLength={10}
          placeholder={user?.phone ?? '10-digit number'}
          value={dropContactPhone}
          onChange={(event) => setDropContactPhone(event.target.value)}
          error={phoneError}
        />
      </div>

      <p className="booking-details__note">
        Leave the recipient blank and we will use your own details.
      </p>

      <div className="booking-details__actions">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Back
        </Button>
        <Button type="submit" disabled={!canSubmit} isLoading={isSubmitting} loadingText="Getting your fare…">
          Get fare estimate
        </Button>
      </div>
    </form>
  )
}
