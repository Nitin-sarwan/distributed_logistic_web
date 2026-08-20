export const ROUTES = {
  home: '/',
  trackOrder: '/track',
  orders: '/orders',
  profile: '/profile',
  addresses: '/profile/addresses',
  security: '/profile/security',
  resetPassword: '/reset-password',
  partnerLogin: '/partner/login',
  partnerSignup: '/partner/signup',
  partner: '/partner',
  partnerDeliveries: '/partner/deliveries',
  partnerVehicle: '/partner/vehicle',
  partnerProfile: '/partner/profile',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]

export function isPartnerRoute(pathname: string): boolean {
  return pathname === '/partner' || pathname.startsWith('/partner/')
}
