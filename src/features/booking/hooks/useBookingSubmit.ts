import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { orderPath } from '@/constants'
import type { Place } from '@/features/geo'
import { createOrder, type AddressPayload, type OrderEndpointPayload } from '@/features/orders'
import { errorMessage } from '@/services'
import type { User } from '@/types'

import type { BookingDetails } from '../types'

export interface UseBookingSubmitResult {
  submit: (details: BookingDetails) => Promise<void>
  isSubmitting: boolean
  error: string | null
}

function toAddress(place: Place, contact: { name: string; phone: string }): AddressPayload {
  return {
    address_line1: place.address_line1,
    address_line2: place.address_line2,
    city: place.city || 'Unknown',
    pin_code: place.pin_code ?? '',
    latitude: place.latitude,
    longitude: place.longitude,
    contact_name: contact.name,
    contact_phone: contact.phone,
  }
}

export function useBookingSubmit(user: User | null): UseBookingSubmitResult {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const idempotencyKey = useRef(crypto.randomUUID())

  const submit = useCallback(
    async (details: BookingDetails) => {
      if (!user) return

      setIsSubmitting(true)
      setError(null)

      const contact = { name: user.name, phone: user.phone }
      const pickup: OrderEndpointPayload = { address: toAddress(details.pickup, contact) }
      const drop: OrderEndpointPayload = {
        address: toAddress(details.drop, {
          name: details.dropContactName || user.name,
          phone: details.dropContactPhone || user.phone,
        }),
      }

      try {
        const order = await createOrder(
          {
            pickup,
            drop,
            vehicle_type: details.vehicleType,
            weight_kg: details.weightKg,
            description: details.description || null,
          },
          idempotencyKey.current,
        )

        navigate(orderPath(order.id))
      } catch (caught) {
        setError(errorMessage(caught, 'Could not create your delivery. Try again.'))
        setIsSubmitting(false)
      }
    },
    [navigate, user],
  )

  return { submit, isSubmitting, error }
}
