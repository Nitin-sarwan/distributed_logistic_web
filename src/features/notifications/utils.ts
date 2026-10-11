import { ROUTES } from '@/constants'

import type { NotificationAudience, NotificationCategory } from './types'

export const CATEGORY_LABELS: Record<NotificationCategory, string> = {
  order: 'Delivery updates',
  offer: 'Job offers',
  payment: 'Payments',
  account: 'Account',
}

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category as NotificationCategory] ?? category
}

/**
 * Where tapping a message goes.
 *
 * The server names routes in its own terms — `/orders/12` for customers,
 * `/deliveries/12` and `/offers` for drivers. The customer paths are this app's
 * paths already; the driver's live under `/partner`, and there is no
 * per-delivery page there, so a delivery opens the list it is in.
 */
export function resolveActionPath(
  audience: NotificationAudience,
  path: string | null,
): string | null {
  if (!path) return null
  if (audience === 'customer') return path

  if (path.startsWith('/deliveries')) return ROUTES.partnerDeliveries
  if (path.startsWith('/offers')) return ROUTES.partner
  return null
}

const RELATIVE = new Intl.RelativeTimeFormat('en-IN', { numeric: 'auto' })

export function relativeTime(iso: string): string {
  const seconds = Math.round((new Date(iso).getTime() - Date.now()) / 1000)
  const abs = Math.abs(seconds)

  if (abs < 45) return 'just now'
  if (abs < 3600) return RELATIVE.format(Math.round(seconds / 60), 'minute')
  if (abs < 86_400) return RELATIVE.format(Math.round(seconds / 3600), 'hour')
  if (abs < 7 * 86_400) return RELATIVE.format(Math.round(seconds / 86_400), 'day')

  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(
    new Date(iso),
  )
}

export function badgeText(count: number, capped: boolean): string {
  return capped ? `${count}+` : String(count)
}
