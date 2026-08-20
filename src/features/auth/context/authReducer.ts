import type { User } from '@/types'

import type { AuthState } from '../types'

export type AuthAction =
  | { type: 'session-resolved'; user: User | null }
  | { type: 'authenticated'; user: User }
  | { type: 'signed-out' }
  | { type: 'user-updated'; user: User }

export const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
}

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'session-resolved':
      return {
        user: action.user,
        isAuthenticated: action.user !== null,
        isLoading: false,
      }

    case 'authenticated':
      return { user: action.user, isAuthenticated: true, isLoading: false }

    case 'signed-out':
      return { user: null, isAuthenticated: false, isLoading: false }

    case 'user-updated':

      return state.isAuthenticated ? { ...state, user: action.user } : state

    default:
      return state
  }
}
