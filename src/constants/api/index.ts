import { DELIVERY_ROUTES } from './deliveries'
import { GEO_ROUTES } from './geo'
import { ORDER_ROUTES } from './orders'
import { PARTNER_ROUTES } from './partners'
import { AUTH_ROUTES, PROFILE_ROUTES } from './users'

export const API_ROUTES = {
  auth: AUTH_ROUTES,
  profile: PROFILE_ROUTES,
  partner: PARTNER_ROUTES,
  geo: GEO_ROUTES,
  orders: ORDER_ROUTES,
  deliveries: DELIVERY_ROUTES,
  health: '/health',
} as const

export {
  AUTH_ROUTES,
  DELIVERY_ROUTES,
  GEO_ROUTES,
  ORDER_ROUTES,
  PARTNER_ROUTES,
  PROFILE_ROUTES,
}
