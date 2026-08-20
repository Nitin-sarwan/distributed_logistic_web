import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ROUTES } from '@/constants'

import { useAuth } from './useAuth'

export interface UseLogoutResult {
  logout: () => Promise<void>
  isLoggingOut: boolean
}

export function useLogout(): UseLogoutResult {
  const { logout: endSession } = useAuth()
  const navigate = useNavigate()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const logout = useCallback(async () => {
    setIsLoggingOut(true)

    try {
      await endSession()
      navigate(ROUTES.home)
    } finally {
      setIsLoggingOut(false)
    }
  }, [endSession, navigate])

  return { logout, isLoggingOut }
}
