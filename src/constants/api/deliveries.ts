const DELIVERIES = '/api/deliveries'

export const DELIVERY_ROUTES = {
  list: DELIVERIES,
  pickedUp: (id: number | string) => `${DELIVERIES}/${id}/picked-up`,
  delivered: (id: number | string) => `${DELIVERIES}/${id}/delivered`,
} as const
