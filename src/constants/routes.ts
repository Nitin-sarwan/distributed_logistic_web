/** Client-side route paths. Referenced by the router, the header, and redirects. */
export const ROUTES = {
  home: '/',
  trackOrder: '/track',
  orders: '/orders',
  profile: '/profile',
  addresses: '/profile/addresses',
  security: '/profile/security',
  resetPassword: '/reset-password',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
