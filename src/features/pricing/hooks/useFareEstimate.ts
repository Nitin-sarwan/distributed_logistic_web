import { useEffect, useState } from 'react'

import { ApiError, errorMessage } from '@/services'

import { estimateFares } from '../api/pricingApi'
import type { FareEstimate, TripEnds } from '../types'

// Long enough that typing "120" in the weight field asks once, not three times.
const DEBOUNCE_MS = 400

export interface UseFareEstimateResult {
  estimate: FareEstimate | null
  isLoading: boolean
  error: string | null
}

/**
 * Every vehicle's price for this trip, refreshed as the trip or weight changes.
 *
 * Keeps showing the last estimate while a new one loads, so the prices on
 * screen change in place rather than flashing to a spinner on every keystroke.
 */
export function useFareEstimate(
  { pickup, drop }: TripEnds,
  weightKg?: number,
): UseFareEstimateResult {
  const [estimate, setEstimate] = useState<FareEstimate | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validWeight =
    weightKg !== undefined && Number.isFinite(weightKg) && weightKg > 0 ? weightKg : undefined

  const pickupLat = pickup?.latitude
  const pickupLng = pickup?.longitude
  const dropLat = drop?.latitude
  const dropLng = drop?.longitude

  useEffect(() => {
    if (
      pickupLat === undefined ||
      pickupLng === undefined ||
      dropLat === undefined ||
      dropLng === undefined
    ) {
      setEstimate(null)
      setIsLoading(false)
      setError(null)
      return
    }

    const controller = new AbortController()
    setIsLoading(true)

    const timer = window.setTimeout(() => {
      estimateFares(
        {
          pickup: { latitude: pickupLat, longitude: pickupLng },
          drop: { latitude: dropLat, longitude: dropLng },
          weight_kg: validWeight,
        },
        controller.signal,
      )
        .then((result) => {
          if (controller.signal.aborted) return
          setEstimate(result)
          setError(null)
        })
        .catch((caught: unknown) => {
          if (controller.signal.aborted) return
          if (caught instanceof ApiError && caught.isCanceled) return
          setError(errorMessage(caught, 'Could not load prices right now.'))
        })
        .finally(() => {
          if (!controller.signal.aborted) setIsLoading(false)
        })
    }, DEBOUNCE_MS)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [pickupLat, pickupLng, dropLat, dropLng, validWeight])

  return { estimate, isLoading, error }
}
