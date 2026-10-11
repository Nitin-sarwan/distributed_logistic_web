const DELIVERIES = '/api/deliveries'

// Answered by paymentServices; nested here so the gateway sends the driver's
// cookie with it (longest prefix wins).
const PAYMENTS = `${DELIVERIES}/payments`

export const DELIVERY_ROUTES = {
  list: DELIVERIES,
  pickedUp: (id: number | string) => `${DELIVERIES}/${id}/picked-up`,
  delivered: (id: number | string) => `${DELIVERIES}/${id}/delivered`,
  payment: (orderId: number | string) => `${PAYMENTS}/${orderId}`,
  paymentUpi: (orderId: number | string) => `${PAYMENTS}/${orderId}/upi`,
  paymentCollect: (orderId: number | string) => `${PAYMENTS}/${orderId}/collect`,
} as const
