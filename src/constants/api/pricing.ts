const PRICING = '/api/pricing'

export const PRICING_ROUTES = {
  estimate: `${PRICING}/estimate`,
  tariffs: `${PRICING}/tariffs`,
} as const
