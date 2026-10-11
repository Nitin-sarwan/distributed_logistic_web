import { useEffect, useState } from 'react'

import { useIsMounted } from '@/hooks'

import * as orderApi from '../api/orderApi'
import type { OrderStatus, OrderTracking } from '../types'

// The driver's app reports every 60s; asking more often than every 10s only
// redraws the same pin.
const POLL_INTERVAL_MS = 10_000

const TRACKABLE: OrderStatus[] = ['partner_assigned', 'picked_up', 'in_transit']

export const isTrackable = (status: OrderStatus): boolean => TRACKABLE.includes(status)

/** The driver's position while they are on this order; null otherwise. */
export function useOrderTracking(
  orderId: number,
  status: OrderStatus | undefined,
): OrderTracking | null {
  const [tracking, setTracking] = useState<OrderTracking | null>(null)
  const isMounted = useIsMounted()
  const active = status !== undefined && isTrackable(status)

  useEffect(() => {
    if (!active) {
      setTracking(null)
      return
    }

    // Cleared on cleanup, so a request still in flight when the order is
    // cancelled or delivered cannot redraw the driver afterwards.
    let current = true
    const load = () =>
      orderApi
        .getOrderTracking(orderId)
        .then((next) => {
          if (current && isMounted.current) setTracking(next)
        })
        .catch(() => {
          // A missed refresh keeps the last pin. The order page already shows
          // its own errors; a tracking hiccup is not worth another banner.
        })

    void load()
    const timer = window.setInterval(load, POLL_INTERVAL_MS)
    return () => {
      current = false
      window.clearInterval(timer)
    }
  }, [active, isMounted, orderId])

  return tracking
}
