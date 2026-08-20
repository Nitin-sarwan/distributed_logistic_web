const USERS = '/api/users'

export const AUTH_ROUTES = {
  register: `${USERS}/register`,
  login: `${USERS}/login`,
  me: `${USERS}/profile`,
  logout: `${USERS}/logout`,
  logoutAll: `${USERS}/logout-all`,
  refresh: `${USERS}/refresh`,
  changePassword: `${USERS}/change-password`,
  forgotPassword: `${USERS}/forgot-password`,
  resetPassword: `${USERS}/reset-password`,
} as const

export const PROFILE_ROUTES = {
  me: `${USERS}/profile`,
  addresses: `${USERS}/addresses`,
  address: (id: number | string) => `${USERS}/addresses/${id}`,
} as const
