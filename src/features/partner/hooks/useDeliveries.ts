import { useCallback, useEffect, useState } from 'react'

import type { Order } from '@/features/orders'
import { useIsMounted } from '@/hooks'
import { ApiError, errorMessage, isSessionEnded } from '@/services'

import * as deliveryApi from '../api/deliveryApi'
import { notifyDeliveriesChanged, onDeliveriesChanged } from './deliveriesChannel'

const POLL_INTERVAL_MS = 20_000

export interface UseDeliveriesResult {
  deliveries: Order[]
  isLoading: boolean
  error: string | null
  unavailable: boolean
  busyId: number | null
  pickUp: (id: number) => Promise<void>
  deliver: (id: number) => Promise<void>
  refresh: () => Promise<void>
}

export function useDeliveries(completed = false): UseDeliveriesResult {
  const [deliveries, setDeliveries] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unavailable, setUnavailable] = useState(false)
  const [busyId, setBusyId] = useState<number | null>(null)
  const isMounted = useIsMounted()

  const load = useCallback(async () => {
    try {
      const data = await deliveryApi.getDeliveries(completed)
      if (!isMounted.current) return
      setDeliveries(data)
      setUnavailable(false)
      setError(null)
    } catch (caught) {
      if (!isMounted.current || isSessionEnded(caught)) return
      const notBuilt = caught instanceof ApiError && caught.isNotFound
      setUnavailable(notBuilt)
      if (!notBuilt) setError(errorMessage(caught, 'Could not load your deliveries.'))
    } finally {
      if (isMounted.current) setIsLoading(false)
    }
  }, [completed, isMounted])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => onDeliveriesChanged(() => void load()), [load])

  useEffect(() => {
    if (completed) return

    const timer = window.setInterval(() => void load(), POLL_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [completed, load])

  const act = useCallback(
    async (id: number, action: () => Promise<Order>, fallback: string) => {
      setBusyId(id)
      setError(null)

      try {
        await action()
        // Reloads this list and the other one: delivered moves a card from
        // "In progress" to "Completed".
        notifyDeliveriesChanged()
      } catch (caught) {
        if (!isMounted.current) return
        setError(errorMessage(caught, fallback))
      } finally {
        if (isMounted.current) setBusyId(null)
      }
    },
    [isMounted, load],
  )

  return {
    deliveries,
    isLoading,
    error,
    unavailable,
    busyId,
    pickUp: useCallback(
      (id: number) =>
        act(id, () => deliveryApi.markPickedUp(id), 'Could not mark this as picked up.'),
      [act],
    ),
    deliver: useCallback(
      (id: number) =>
        act(id, () => deliveryApi.markDelivered(id), 'Could not mark this as delivered.'),
      [act],
    ),
    refresh: load,
  }
}
