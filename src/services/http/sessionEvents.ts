import type { SessionAudience } from '../sessionTransport'

export type SessionExpiredListener = (audience: SessionAudience) => void

const listeners = new Set<SessionExpiredListener>()

export function onSessionExpired(listener: SessionExpiredListener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function emitSessionExpired(audience: SessionAudience): void {
  listeners.forEach((listener) => listener(audience))
}
