import { createContext } from 'react'

import type { User } from '@/types'

import type { AuthState, LoginPayload, RegisterPayload } from '../types'

export interface AuthContextValue extends AuthState {
  login: (payload: LoginPayload) => Promise<User>
  signup: (payload: RegisterPayload) => Promise<User>
  logout: () => Promise<void>
  logoutEverywhere: () => Promise<number>
  refreshUser: () => Promise<void>
  clearSession: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
