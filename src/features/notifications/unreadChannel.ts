import type { NotificationAudience } from './types'

type Listener = (count: number) => void

const listeners: Record<NotificationAudience, Set<Listener>> = {
  customer: new Set(),
  partner: new Set(),
}

/**
 * The feed knows the new badge number the moment it marks something read — the
 * server returns it. This hands that number to the header's bell directly,
 * rather than leaving the badge wrong until its next poll.
 */
export function publishUnread(audience: NotificationAudience, count: number): void {
  listeners[audience].forEach((listener) => listener(count))
}

export function subscribeUnread(audience: NotificationAudience, listener: Listener): () => void {
  listeners[audience].add(listener)
  return () => {
    listeners[audience].delete(listener)
  }
}
