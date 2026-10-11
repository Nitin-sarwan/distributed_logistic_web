const DISPATCH = '/api/dispatch'

export const DISPATCH_ROUTES = {
  currentOffer: `${DISPATCH}/offers/current`,
  accept: (id: number | string) => `${DISPATCH}/offers/${id}/accept`,
  decline: (id: number | string) => `${DISPATCH}/offers/${id}/decline`,
} as const
