import { useState, type FormEvent } from 'react'

import { Alert } from '@/components/Alert'
import { Button } from '@/components/Button'
import { useRequireAuth } from '@/features/auth'

import { useBooking } from '../hooks/useBooking'
import { BookingFields } from './BookingFields'
import { BookingTripMap } from './BookingTripMap'

import './Booking.css'

export function BookingWidget() {
  const requireAuth = useRequireAuth()
  const booking = useBooking()
  const [notice, setNotice] = useState<string | null>(null)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setNotice(null)

    requireAuth(() => {
      setNotice(
        'Pricing is not connected yet. Once the Pricing and Order services are live, this will return a fare estimate for your trip.',
      )
    })
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
        Get estimate
      </Button>

      {notice && <Alert tone="info">{notice}</Alert>}
    </form>
  )
}
