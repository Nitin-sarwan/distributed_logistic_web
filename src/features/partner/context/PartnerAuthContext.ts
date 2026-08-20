import { createContext } from 'react'

import type {
  Partner,
  PartnerAuthState,
  PartnerLoginPayload,
  PartnerRegisterPayload,
  PartnerUpdatePayload,
} from '../types'

export interface PartnerAuthContextValue extends PartnerAuthState {
  login: (payload: PartnerLoginPayload) => Promise<Partner>
  signup: (payload: PartnerRegisterPayload) => Promise<Partner>
  logout: () => Promise<void>
  logoutEverywhere: () => Promise<number>
  updateProfile: (payload: PartnerUpdatePayload) => Promise<Partner>
  setStatus: (status: 'online' | 'offline') => Promise<Partner>
  pushLocation: () => Promise<boolean>
  refreshPartner: () => Promise<void>
  clearSession: () => void
}

export const PartnerAuthContext = createContext<PartnerAuthContextValue | null>(null)
