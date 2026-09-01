import { useCallback, useEffect, useState } from 'react'

import { useIsMounted } from '@/hooks'
import { ApiError, errorMessage, isSessionEnded } from '@/services'

import * as orderApi from '../api/orderApi'
import type { Order } from '../types'

export interface UseOrdersResult {
  orders: Order[]
  isLoading: boolean
  error: string | null
  unavailable: boolean
  refresh: () => Promise<void>
}

export function useOrders(): UseOrdersResult {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unavailable, setUnavailable] = useState(false)
  const isMounted = useIsMounted()

  const load = useCallback(async () => {
    setError(null)

    try {
      const data = await orderApi.getOrders()
      if (!isMounted.current) return
      setOrders(data)
      setUnavailable(false)
    } catch (caught) {
      if (!isMounted.current) return
      if (isSessionEnded(caught)) return

      const notBuilt = caught instanceof ApiError && caught.isNotFound
      setUnavailable(notBuilt)
      if (!notBuilt) setError(errorMessage(caught, 'Could not load your orders.'))
    } finally {
      if (isMounted.current) setIsLoading(false)
    }
  }, [isMounted])

  useEffect(() => {
    void load()
  }, [load])

  return { orders, isLoading, error, unavailable, refresh: load }
}
