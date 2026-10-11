import { useCallback, useEffect, useRef, useState } from 'react'

import { useIsMounted } from '@/hooks'
import { ApiError, errorMessage, isSessionEnded } from '@/services'

import * as offerApi from '../api/offerApi'
import type { OfferCard } from '../types'

// Offers live for ~30s, so a 4s poll costs a driver at most a few seconds of it.
// Push replaces this when the push worker exists; the endpoint does not change.
const POLL_INTERVAL_MS = 4_000
const TICK_MS = 250

export type OfferNoticeTone = 'success' | 'info' | 'error'

export interface OfferNotice {
  tone: OfferNoticeTone
  text: string
}

export interface UseCurrentOfferResult {
  offer: OfferCard | null
  secondsLeft: number
  /** 1 → 0 over the offer's life, for the countdown bar. */
  fractionLeft: number
  isResponding: boolean
  notice: OfferNotice | null
  accept: () => Promise<void>
  decline: () => Promise<void>
  dismissNotice: () => void
}

/**
 * The job on this driver's screen right now, if any.
 *
 * The countdown is anchored to `seconds_remaining` from the server, re-anchored
 * on every poll, and only ticked locally in between — the phone's own clock is
 * never compared with `expires_at`.
 */
export function useCurrentOffer(
  enabled: boolean,
  onAccepted?: (orderId: number) => void,
): UseCurrentOfferResult {
  const [offer, setOffer] = useState<OfferCard | null>(null)
  const [deadline, setDeadline] = useState(0)
  const [total, setTotal] = useState(1)
  const [now, setNow] = useState(() => Date.now())
  const [isResponding, setIsResponding] = useState(false)
  const [notice, setNotice] = useState<OfferNotice | null>(null)
  const isMounted = useIsMounted()

  const offerIdRef = useRef<number | null>(null)
  // The offer this driver last answered. A poll that left before the answer
  // and returns after it would otherwise put the offer back on screen.
  const answeredIdRef = useRef<number | null>(null)
  const onAcceptedRef = useRef(onAccepted)
  onAcceptedRef.current = onAccepted

  const clear = useCallback(() => {
    offerIdRef.current = null
    setOffer(null)
  }, [])

  const poll = useCallback(async () => {
    try {
      const current = await offerApi.getCurrentOffer()
      if (!isMounted.current) return

      // seconds_remaining 0 is an offer the server has not swept yet: already gone.
      if (!current || current.seconds_remaining <= 0 || current.offer_id === answeredIdRef.current) {
        clear()
        return
      }

      const isNew = current.offer_id !== offerIdRef.current
      offerIdRef.current = current.offer_id
      setOffer(current)
      setDeadline(Date.now() + current.seconds_remaining * 1000)
      if (isNew) {
        setTotal(Math.max(1, current.seconds_remaining))
        setNotice(null)
      }
    } catch (caught) {
      // A failed poll is not worth interrupting a driver for — the next one
      // will most likely succeed. Session end is handled app-wide.
      if (isSessionEnded(caught)) clear()
    }
  }, [clear, isMounted])

  useEffect(() => {
    if (!enabled) {
      clear()
      return
    }

    void poll()
    const timer = window.setInterval(() => void poll(), POLL_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [clear, enabled, poll])

  useEffect(() => {
    if (!offer) return
    const timer = window.setInterval(() => setNow(Date.now()), TICK_MS)
    return () => window.clearInterval(timer)
  }, [offer])

  const secondsLeft = offer ? Math.max(0, Math.ceil((deadline - now) / 1000)) : 0

  useEffect(() => {
    if (offer && secondsLeft === 0 && !isResponding) {
      clear()
      setNotice({ tone: 'info', text: 'That offer ran out of time and went to the next driver.' })
    }
  }, [clear, isResponding, offer, secondsLeft])

  const respond = useCallback(
    async (kind: 'accept' | 'decline') => {
      const current = offerIdRef.current
      if (current === null) return

      setIsResponding(true)
      answeredIdRef.current = current
      try {
        const result =
          kind === 'accept'
            ? await offerApi.acceptOffer(current)
            : await offerApi.declineOffer(current)
        if (!isMounted.current) return
        clear()
        if (kind === 'accept') {
          setNotice({ tone: 'success', text: 'The delivery is yours. Head to the pickup.' })
          onAcceptedRef.current?.(result.order_id)
        } else {
          setNotice({ tone: 'info', text: 'Declined. We will offer it to someone else.' })
        }
      } catch (caught) {
        if (!isMounted.current || isSessionEnded(caught)) return
        // 503 means nothing was recorded and the offer is still live: keep it on
        // screen so tapping again works. Every other failure means it is gone.
        const stillLive = caught instanceof ApiError && caught.status === 503
        if (stillLive) answeredIdRef.current = null
        else clear()
        setNotice({
          tone: stillLive ? 'error' : 'info',
          text: errorMessage(caught, 'Could not answer that offer. Try again.'),
        })
      } finally {
        if (isMounted.current) setIsResponding(false)
      }
    },
    [clear, isMounted],
  )

  return {
    offer,
    secondsLeft,
    fractionLeft: offer ? Math.min(1, secondsLeft / total) : 0,
    isResponding,
    notice,
    accept: useCallback(() => respond('accept'), [respond]),
    decline: useCallback(() => respond('decline'), [respond]),
    dismissNotice: useCallback(() => setNotice(null), []),
  }
}
