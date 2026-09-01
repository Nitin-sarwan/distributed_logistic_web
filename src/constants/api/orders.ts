const ORDERS = '/api/orders'

export const ORDER_ROUTES = {
  list: ORDERS,
  one: (id: number | string) => `${ORDERS}/${id}`,
  history: (id: number | string) => `${ORDERS}/${id}/history`,
  confirm: (id: number | string) => `${ORDERS}/${id}/confirm`,
  cancel: (id: number | string) => `${ORDERS}/${id}/cancel`,
} as const
