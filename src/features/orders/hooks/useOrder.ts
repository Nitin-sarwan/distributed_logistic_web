import { useCallback, useEffect, useRef, useState } from 'react'

import { useIsMounted } from '@/hooks'
import { errorMessage, isSessionEnded } from '@/services'

import * as orderApi from '../api/orderApi'
import type { Order, OrderStatusEntry } from '../types'
import { isLive } from '../utils'

const POLL_INTERVAL_MS = 10_000

export interface UseOrderResult {
  order: Order | null
  history: OrderStatusEntry[]
  isLoading: boolean
  error: string | null
  isWorking: boolean
  confirm: () => Promise<void>
  cancel: (reason?: string) => Promise<void>
  refresh: () => Promise<void>
}

export function useOrder(orderId: number): UseOrderResult {
  const [order, setOrder] = useState<Order | null>(null)
  const [history, setHistory] = useState<OrderStatusEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isWorking, setIsWorking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isMounted = useIsMounted()

  const load = useCallback(async () => {
    try {
      const [next, entries] = await Promise.all([
        orderApi.getOrder(orderId),
        orderApi.getOrderHistory(orderId),
      ])
      if (!isMounted.current) return
      setOrder(next)
      setHistory(entries)
      setError(null)
    } catch (caught) {
      if (!isMounted.current || isSessionEnded(caught)) return
      setError(errorMessage(caught, 'Could not load this order.'))
    } finally {
      if (isMounted.current) setIsLoading(false)
    }
  }, [isMounted, orderId])

  useEffect(() => {
    void load()
  }, [load])

  const liveRef = useRef(false)
  liveRef.current = order !== null && isLive(order.status)

  useEffect(() => {
    if (!liveRef.current) return

    const timer = window.setInterval(() => {
      if (liveRef.current) void load()
    }, POLL_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [load, order?.status])

  const act = useCallback(
    async (action: () => Promise<Order>, fallback: string) => {
      setIsWorking(true)
      setError(null)

      try {
        const next = await action()
        if (!isMounted.current) return
        setOrder(next)
        void load()
      } catch (caught) {
        if (!isMounted.current) return
        setError(errorMessage(caught, fallback))
      } finally {
        if (isMounted.current) setIsWorking(false)
      }
    },
    [isMounted, load],
  )

  return {
    order,
    history,
    isLoading,
    error,
    isWorking,
    confirm: useCallback(
      () => act(() => orderApi.confirmOrder(orderId), 'Could not confirm this order.'),
      [act, orderId],
    ),
    cancel: useCallback(
      (reason?: string) =>
        act(() => orderApi.cancelOrder(orderId, reason), 'Could not cancel this order.'),
      [act, orderId],
    ),
    refresh: load,
  }
}
