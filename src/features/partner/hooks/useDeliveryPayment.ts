import { useCallback, useState } from 'react'

import { useIsMounted } from '@/hooks'
import { errorMessage } from '@/services'

import * as paymentApi from '../api/paymentApi'
import { notifyDeliveriesChanged } from './deliveriesChannel'

export interface UseDeliveryPaymentResult {
  /** Set the moment the driver records it, before the order catches up. */
  collectedVia: 'cash' | 'upi' | null
  upi: paymentApi.UpiRequest | null
  isBusy: boolean
  error: string | null
  openUpi: () => Promise<void>
  closeUpi: () => void
  collect: (via: 'cash' | 'upi') => Promise<void>
}

// Order learns "paid" from Payment's event a moment later; reload the lists
// once it has, so the card and "Completed" show the settled delivery.
const ORDER_CATCH_UP_MS = 1_500

export function useDeliveryPayment(orderId: number): UseDeliveryPaymentResult {
  const [collectedVia, setCollectedVia] = useState<'cash' | 'upi' | null>(null)
  const [upi, setUpi] = useState<paymentApi.UpiRequest | null>(null)
  const [isBusy, setIsBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isMounted = useIsMounted()

  const openUpi = useCallback(async () => {
    setIsBusy(true)
    setError(null)
    try {
      const request = await paymentApi.getUpiRequest(orderId)
      if (isMounted.current) setUpi(request)
    } catch (caught) {
      if (isMounted.current) setError(errorMessage(caught, 'Could not create the UPI QR.'))
    } finally {
      if (isMounted.current) setIsBusy(false)
    }
  }, [isMounted, orderId])

  const collect = useCallback(
    async (via: 'cash' | 'upi') => {
      setIsBusy(true)
      setError(null)
      try {
        await paymentApi.collectPayment(orderId, via)
        if (!isMounted.current) return
        setCollectedVia(via)
        setUpi(null)
        window.setTimeout(notifyDeliveriesChanged, ORDER_CATCH_UP_MS)
      } catch (caught) {
        if (isMounted.current) setError(errorMessage(caught, 'Could not record the payment.'))
      } finally {
        if (isMounted.current) setIsBusy(false)
      }
    },
    [isMounted, orderId],
  )

  return {
    collectedVia,
    upi,
    isBusy,
    error,
    openUpi,
    closeUpi: useCallback(() => setUpi(null), []),
    collect,
  }
}
