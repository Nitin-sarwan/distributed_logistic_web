import type { Partner, PartnerAuthState } from '../types'

export type PartnerAuthAction =
  | { type: 'session-resolved'; partner: Partner | null }
  | { type: 'authenticated'; partner: Partner }
  | { type: 'signed-out' }
  | { type: 'partner-updated'; partner: Partner }

export const initialPartnerAuthState: PartnerAuthState = {
  partner: null,
  isAuthenticated: false,
  isLoading: true,
}

export function partnerAuthReducer(
  state: PartnerAuthState,
  action: PartnerAuthAction,
): PartnerAuthState {
  switch (action.type) {
    case 'session-resolved':
      return {
        partner: action.partner,
        isAuthenticated: action.partner !== null,
        isLoading: false,
      }

    case 'authenticated':
      return { partner: action.partner, isAuthenticated: true, isLoading: false }

    case 'signed-out':
      return { partner: null, isAuthenticated: false, isLoading: false }

    case 'partner-updated':

      return state.isAuthenticated ? { ...state, partner: action.partner } : state

    default:
      return state
  }
}
