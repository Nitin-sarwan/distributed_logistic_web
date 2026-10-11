import { API_ROUTES } from '@/constants'
import { post } from '@/services'

import type { EstimatePayload, FareEstimate } from '../types'

// Public: no session needed, so it works before the visitor has signed in.
export function estimateFares(
  payload: EstimatePayload,
  signal?: AbortSignal,
): Promise<FareEstimate> {
  return post<FareEstimate>(API_ROUTES.pricing.estimate, payload, { signal })
}
