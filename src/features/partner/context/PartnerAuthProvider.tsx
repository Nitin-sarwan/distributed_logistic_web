import { useCallback, useMemo, useReducer, type ReactNode } from 'react'

import { useIsMounted, useSessionExpiry, useSessionProbe } from '@/hooks'

import * as partnerApi from '../api'
import { useDevicePosition } from '../hooks/useDevicePosition'
import { useLocationHeartbeat } from '../hooks/useLocationHeartbeat'
import type { PartnerLoginPayload, PartnerRegisterPayload, PartnerUpdatePayload } from '../types'
import { PartnerAuthContext, type PartnerAuthContextValue } from './PartnerAuthContext'
import { initialPartnerAuthState, partnerAuthReducer } from './partnerAuthReducer'

export function PartnerAuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(partnerAuthReducer, initialPartnerAuthState)
  const isMounted = useIsMounted()
  const readPosition = useDevicePosition()

  useSessionProbe(partnerApi.getCurrentPartner, (partner) =>
    dispatch({ type: 'session-resolved', partner }),
  )

  useSessionExpiry(
    'partner',
    useCallback(() => dispatch({ type: 'signed-out' }), []),
  )

  const login = useCallback(
    async (payload: PartnerLoginPayload) => {
      const partner = await partnerApi.login(payload)
      if (isMounted.current) dispatch({ type: 'authenticated', partner })
      return partner
    },
    [isMounted],
  )

  const signup = useCallback(
    async (payload: PartnerRegisterPayload) => {
      const partner = await partnerApi.signup(payload)
      if (isMounted.current) dispatch({ type: 'authenticated', partner })
      return partner
    },
    [isMounted],
  )

  const logout = useCallback(async () => {
    try {
      await partnerApi.logout()
    } finally {
      if (isMounted.current) dispatch({ type: 'signed-out' })
    }
  }, [isMounted])

  const logoutEverywhere = useCallback(async () => {
    try {
      return await partnerApi.logoutEverywhere()
    } finally {
      if (isMounted.current) dispatch({ type: 'signed-out' })
    }
  }, [isMounted])

  const updateProfile = useCallback(
    async (payload: PartnerUpdatePayload) => {
      const partner = await partnerApi.updateProfile(payload)
      if (isMounted.current) dispatch({ type: 'partner-updated', partner })
      return partner
    },
    [isMounted],
  )

  const pushLocation = useCallback(async () => {
    const position = await readPosition()
    if (!position) return false

    const partner = await partnerApi.updateLocation(position)
    if (isMounted.current) dispatch({ type: 'partner-updated', partner })
    return true
  }, [isMounted, readPosition])

  const setStatus = useCallback(
    async (status: 'online' | 'offline') => {
      const partner = await partnerApi.setStatus(status)
      if (isMounted.current) dispatch({ type: 'partner-updated', partner })

      if (status === 'online') void pushLocation().catch(() => undefined)

      return partner
    },
    [isMounted, pushLocation],
  )

  const refreshPartner = useCallback(async () => {
    const partner = await partnerApi.getProfile()
    if (isMounted.current) dispatch({ type: 'partner-updated', partner })
  }, [isMounted])

  const clearSession = useCallback(() => dispatch({ type: 'signed-out' }), [])

  useLocationHeartbeat(state.partner?.status === 'online', pushLocation)

  const value = useMemo<PartnerAuthContextValue>(
    () => ({
      ...state,
      login,
      signup,
      logout,
      logoutEverywhere,
      updateProfile,
      setStatus,
      pushLocation,
      refreshPartner,
      clearSession,
    }),
    [
      state,
      login,
      signup,
      logout,
      logoutEverywhere,
      updateProfile,
      setStatus,
      pushLocation,
      refreshPartner,
      clearSession,
    ],
  )

  return (
    <PartnerAuthContext.Provider value={value}>{children}</PartnerAuthContext.Provider>
  )
}
