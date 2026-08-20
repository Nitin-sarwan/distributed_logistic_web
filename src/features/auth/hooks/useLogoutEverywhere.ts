import { useCallback, useState } from 'react'

import { errorMessage } from '@/services'

import { useAuth } from './useAuth'

export interface UseLogoutEverywhereResult {
  logoutEverywhere: () => Promise<void>
  isRevoking: boolean
  error: string | null
}

export function useLogoutEverywhere(): UseLogoutEverywhereResult {
  const { logoutEverywhere: revokeAll } = useAuth()
  const [isRevoking, setIsRevoking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const logoutEverywhere = useCallback(async () => {
    setIsRevoking(true)
    setError(null)

    try {
      await revokeAll()
    } catch (caught) {
      setError(errorMessage(caught, 'Could not sign out of your other devices.'))
    } finally {
      setIsRevoking(false)
    }
  }, [revokeAll])

  return { logoutEverywhere, isRevoking, error }
}
