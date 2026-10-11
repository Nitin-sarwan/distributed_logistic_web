import { DELIVERY_ROUTES } from './deliveries'
import { DISPATCH_ROUTES } from './dispatch'
import { GEO_ROUTES } from './geo'
import { ORDER_ROUTES } from './orders'
import { PARTNER_ROUTES } from './partners'
import { PRICING_ROUTES } from './pricing'
import { AUTH_ROUTES, PROFILE_ROUTES } from './users'

export const API_ROUTES = {
  auth: AUTH_ROUTES,
  profile: PROFILE_ROUTES,
  partner: PARTNER_ROUTES,
  geo: GEO_ROUTES,
  orders: ORDER_ROUTES,
  deliveries: DELIVERY_ROUTES,
  dispatch: DISPATCH_ROUTES,
  pricing: PRICING_ROUTES,
  health: '/health',
} as const

export {
  AUTH_ROUTES,
  DELIVERY_ROUTES,
  DISPATCH_ROUTES,
  GEO_ROUTES,
  ORDER_ROUTES,
  PARTNER_ROUTES,
  PRICING_ROUTES,
  PROFILE_ROUTES,
}

export { NOTIFICATION_BASES, notificationRoutes } from './notifications'
export type { NotificationAudience } from './notifications'
