import { useCallback, useEffect, useMemo, useState } from 'react'

import { useIsMounted } from '@/hooks'
import { errorMessage, isSessionEnded } from '@/services'

import * as partnerApi from '../api'
import type { Vehicle } from '../types'

export interface UseVehicleListResult {
  vehicles: Vehicle[]
  setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>
  activeVehicle: Vehicle | null
  isLoading: boolean
  error: string | null
  setError: (message: string | null) => void
  load: () => Promise<void>
  isMounted: React.MutableRefObject<boolean>
}

export function useVehicleList(): UseVehicleListResult {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const isMounted = useIsMounted()

  const load = useCallback(async () => {
    setError(null)

    try {
      const data = await partnerApi.getVehicles()
      if (isMounted.current) setVehicles(data)
    } catch (caught) {
      if (!isMounted.current) return

      if (isSessionEnded(caught)) return
      setError(errorMessage(caught, 'Could not load your vehicles.'))
    } finally {
      if (isMounted.current) setIsLoading(false)
    }
  }, [isMounted])

  useEffect(() => {
    void load()
  }, [load])

  const activeVehicle = useMemo(
    () => vehicles.find((vehicle) => vehicle.status === 'active') ?? null,
    [vehicles],
  )

  return {
    vehicles,
    setVehicles,
    activeVehicle,
    isLoading,
    error,
    setError,
    load,
    isMounted,
  }
}
