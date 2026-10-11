export type AuthTransport = 'cookie' | 'bearer'

export type SessionAudience = 'user' | 'partner'

export const AUTH_TRANSPORT: AuthTransport =
  import.meta.env.VITE_AUTH_TRANSPORT === 'bearer' ? 'bearer' : 'cookie'

// /api/deliveries also covers /api/deliveries/notifications, the driver's feed.
const PARTNER_PREFIXES = ['/api/partners', '/api/deliveries', '/api/dispatch']

export function audienceForPath(url: string | undefined): SessionAudience {
  if (!url) return 'user'
  return PARTNER_PREFIXES.some((prefix) => url.startsWith(prefix)) ? 'partner' : 'user'
}

const sessionTokens: Record<SessionAudience, string | null> = {
  user: null,
  partner: null,
}

export function setSessionToken(
  token: string | null,
  audience: SessionAudience = 'user',
): void {
  if (AUTH_TRANSPORT === 'cookie') return
  sessionTokens[audience] = token
}

export function clearSessionToken(audience: SessionAudience = 'user'): void {
  sessionTokens[audience] = null
}

export function authHeaders(audience: SessionAudience = 'user'): Record<string, string> {
  const token = sessionTokens[audience]
  if (AUTH_TRANSPORT === 'cookie' || !token) return {}
  return { Authorization: `Bearer ${token}` }
}

export function mayHaveSession(audience: SessionAudience = 'user'): boolean {
  return AUTH_TRANSPORT === 'cookie' || sessionTokens[audience] !== null
}
