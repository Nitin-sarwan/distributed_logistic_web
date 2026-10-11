type Listener = () => void

const listeners = new Set<Listener>()

/**
 * The in-progress and completed lists are separate hooks with separate
 * requests, so marking one delivery delivered must tell the other list too, or
 * "Completed" stays empty until the page is reloaded.
 */
export function notifyDeliveriesChanged(): void {
  listeners.forEach((listener) => listener())
}

export function onDeliveriesChanged(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

// After an offer is accepted, Order records the assignment from Kafka a moment
// later. Asking straight away finds nothing, so ask a few times over the next
// few seconds instead of waiting for the next 20-second poll.
const AFTER_ACCEPT_DELAYS_MS = [1_000, 3_000, 6_000]

export function refreshDeliveriesAfterAccept(): void {
  AFTER_ACCEPT_DELAYS_MS.forEach((delay) => window.setTimeout(notifyDeliveriesChanged, delay))
}
