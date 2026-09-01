import { useState, type FormEvent } from 'react'

import { Alert } from '@/components/Alert'
import { Button } from '@/components/Button'
import { useAuth, useRequireAuth } from '@/features/auth'

import { useBooking } from '../hooks/useBooking'
import { BookingDetailsForm } from './BookingDetailsForm'
import { BookingFields } from './BookingFields'
import { BookingTripMap } from './BookingTripMap'

import './Booking.css'

export function BookingWidget() {
  const requireAuth = useRequireAuth()
  const { user } = useAuth()
  const booking = useBooking()

  const [isDetailing, setIsDetailing] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)

  const bothEndsResolved = booking.pickup.place !== null && booking.drop.place !== null

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setNotice(null)

    if (!bothEndsResolved) {
      setNotice('Pick both locations from the suggestions so we know where to send a driver.')
      return
    }

    requireAuth(() => setIsDetailing(true))
  }

  if (isDetailing && booking.pickup.place && booking.drop.place) {
    return (
      <BookingDetailsForm
        pickup={booking.pickup.place}
        drop={booking.drop.place}
        user={user}
        onCancel={() => setIsDetailing(false)}
      />
    )
  }

  return (
    <form className="booking" onSubmit={handleSubmit}>
      <BookingFields
        pickup={booking.pickup}
        drop={booking.drop}
        isLocating={booking.isLocating}
        onPickupText={booking.setPickupText}
        onDropText={booking.setDropText}
        onPickupSelect={booking.selectPickup}
        onDropSelect={booking.selectDrop}
        onUseCurrentLocation={() => void booking.useCurrentPickup()}
      />

      <BookingTripMap
        center={booking.center}
        markers={booking.markers}
        straightLineKm={booking.straightLineKm}
      />

      <Button type="submit" size="lg" fullWidth disabled={!booking.canSubmit}>
        Continue
      </Button>

      {notice && <Alert tone="info">{notice}</Alert>}
    </form>
  )
}
