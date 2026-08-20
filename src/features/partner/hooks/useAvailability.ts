import { useCallback, useState } from 'react'

import { errorMessage } from '@/services'

import type { AvailabilityBlock, Vehicle } from '../types'
import { availabilityBlock } from '../utils'
import { usePartner } from './usePartner'
import { usePartnerLocation } from './usePartnerLocation'

export interface UseAvailabilityOptions {
  activeVehicle: Vehicle | null
  isVehiclesLoading?: boolean
}

export interface UseAvailabilityResult {
  isOnline: boolean
  block: AvailabilityBlock | null
  isBusy: boolean
  error: string | null
  toggle: () => Promise<void>
  location: ReturnType<typeof usePartnerLocation>
}

export function useAvailability({
  activeVehicle,
  isVehiclesLoading = false,
}: UseAvailabilityOptions): UseAvailabilityResult {
  const { partner, setStatus } = usePartner()
  const location = usePartnerLocation()

  const [isBusy, setIsBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isOnline = partner?.status === 'online'

  const toggle = useCallback(async () => {
    if (!partner) return

    setIsBusy(true)
    setError(null)

    try {
      await setStatus(isOnline ? 'offline' : 'online')
    } catch (caught) {
      setError(errorMessage(caught, 'Could not change your availability. Try again.'))
    } finally {
      setIsBusy(false)
    }
  }, [isOnline, partner, setStatus])

  return {
    isOnline,
    block: !partner || isVehiclesLoading ? null : availabilityBlock(partner, activeVehicle),
    isBusy,
    error,
    toggle,
    location,
  }
}
