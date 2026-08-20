const PARTNERS = '/api/partners'

export const PARTNER_ROUTES = {
  register: `${PARTNERS}/register`,
  login: `${PARTNERS}/login`,
  refresh: `${PARTNERS}/refresh`,
  logout: `${PARTNERS}/logout`,
  logoutAll: `${PARTNERS}/logout-all`,
  changePassword: `${PARTNERS}/change-password`,
  me: `${PARTNERS}/me`,
  status: `${PARTNERS}/me/status`,
  location: `${PARTNERS}/me/location`,
  vehicles: `${PARTNERS}/me/vehicles`,
  vehicle: (id: number | string) => `${PARTNERS}/me/vehicles/${id}`,
  activateVehicle: (id: number | string) => `${PARTNERS}/me/vehicles/${id}/activate`,
} as const
