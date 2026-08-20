import { useContext } from 'react'

import {
  PartnerAuthContext,
  type PartnerAuthContextValue,
} from '../context/PartnerAuthContext'

export function usePartner(): PartnerAuthContextValue {
  const context = useContext(PartnerAuthContext)

  if (!context) {
    throw new Error('usePartner must be used inside <PartnerAuthProvider>.')
  }

  return context
}
