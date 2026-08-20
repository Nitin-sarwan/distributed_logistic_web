import { useCallback, useState } from 'react'

import { errorMessage } from '@/services'

import * as partnerApi from '../api'
import type { CreateVehiclePayload, UpdateVehiclePayload, Vehicle } from '../types'
import { useVehicleList } from './useVehicleList'

export interface UseVehiclesResult {
  vehicles: Vehicle[]
  activeVehicle: Vehicle | null
  isLoading: boolean
  error: string | null
  isCreating: boolean
  busyId: number | null
  create: (payload: CreateVehiclePayload) => Promise<void>
  update: (id: number, payload: UpdateVehiclePayload) => Promise<void>
  activate: (id: number) => Promise<void>
  remove: (id: number) => Promise<void>
  refresh: () => Promise<void>
  dismissError: () => void
}

export function useVehicles(): UseVehiclesResult {
  const list = useVehicleList()
  const { setVehicles, setError, load, isMounted } = list

  const [isCreating, setIsCreating] = useState(false)
  const [busyId, setBusyId] = useState<number | null>(null)

  const create = useCallback(
    async (payload: CreateVehiclePayload) => {
      setIsCreating(true)
      setError(null)

      try {
        const created = await partnerApi.createVehicle(payload)
        if (!isMounted.current) return

        setVehicles((current) => [...current, created])
      } finally {
        if (isMounted.current) setIsCreating(false)
      }
    },
    [isMounted, setError, setVehicles],
  )

  const update = useCallback(
    async (id: number, payload: UpdateVehiclePayload) => {
      setBusyId(id)
      setError(null)

      try {
        const updated = await partnerApi.updateVehicle(id, payload)
        if (!isMounted.current) return
        setVehicles((current) => current.map((v) => (v.id === id ? updated : v)))
      } finally {
        if (isMounted.current) setBusyId(null)
      }
    },
    [isMounted, setError, setVehicles],
  )

  const activate = useCallback(
    async (id: number) => {
      setBusyId(id)
      setError(null)

      try {
        await partnerApi.activateVehicle(id)
        await load()
      } catch (caught) {
        if (!isMounted.current) return
        setError(errorMessage(caught, 'Could not switch to that vehicle.'))
      } finally {
        if (isMounted.current) setBusyId(null)
      }
    },
    [isMounted, load, setError],
  )

  const remove = useCallback(
    async (id: number) => {
      setBusyId(id)
      setError(null)

      try {
        await partnerApi.deleteVehicle(id)
        if (!isMounted.current) return
        setVehicles((current) => current.filter((vehicle) => vehicle.id !== id))
      } catch (caught) {
        if (!isMounted.current) return

        setError(errorMessage(caught, 'Could not remove that vehicle.'))
      } finally {
        if (isMounted.current) setBusyId(null)
      }
    },
    [isMounted, setError, setVehicles],
  )

  return {
    vehicles: list.vehicles,
    activeVehicle: list.activeVehicle,
    isLoading: list.isLoading,
    error: list.error,
    isCreating,
    busyId,
    create,
    update,
    activate,
    remove,
    refresh: load,
    dismissError: useCallback(() => setError(null), [setError]),
  }
}
