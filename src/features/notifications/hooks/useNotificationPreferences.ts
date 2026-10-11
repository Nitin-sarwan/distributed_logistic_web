import { useCallback, useEffect, useState } from 'react'

import { useIsMounted } from '@/hooks'
import { errorMessage, isSessionEnded } from '@/services'

import * as notificationApi from '../api/notificationApi'
import type { NotificationAudience, NotificationPreferences, PreferenceUpdate } from '../types'

export interface UseNotificationPreferencesResult {
  preferences: NotificationPreferences | null
  isLoading: boolean
  isSaving: boolean
  error: string | null
  setChannel: (channel: 'email_enabled' | 'push_enabled', on: boolean) => Promise<void>
  setCategoryMuted: (category: string, muted: boolean) => Promise<void>
}

export function useNotificationPreferences(
  audience: NotificationAudience,
): UseNotificationPreferencesResult {
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isMounted = useIsMounted()

  useEffect(() => {
    notificationApi
      .getPreferences(audience)
      .then((result) => {
        if (isMounted.current) setPreferences(result)
      })
      .catch((caught: unknown) => {
        if (!isMounted.current || isSessionEnded(caught)) return
        setError(errorMessage(caught, 'Could not load your notification settings.'))
      })
      .finally(() => {
        if (isMounted.current) setIsLoading(false)
      })
  }, [audience, isMounted])

  // One field per request — the server's PATCH is partial for exactly this, so
  // a toggle here cannot overwrite a change made on another device.
  const save = useCallback(
    async (update: PreferenceUpdate) => {
      setIsSaving(true)
      setError(null)
      try {
        const result = await notificationApi.updatePreferences(audience, update)
        if (isMounted.current) setPreferences(result)
      } catch (caught) {
        if (!isMounted.current || isSessionEnded(caught)) return
        setError(errorMessage(caught, 'Could not save that setting.'))
      } finally {
        if (isMounted.current) setIsSaving(false)
      }
    },
    [audience, isMounted],
  )

  const setChannel = useCallback(
    (channel: 'email_enabled' | 'push_enabled', on: boolean) => save({ [channel]: on }),
    [save],
  )

  const setCategoryMuted = useCallback(
    (category: string, muted: boolean) => {
      const current = preferences?.muted_categories ?? []
      const next = muted
        ? Array.from(new Set([...current, category]))
        : current.filter((value) => value !== category)
      return save({ muted_categories: next })
    },
    [preferences, save],
  )

  return { preferences, isLoading, isSaving, error, setChannel, setCategoryMuted }
}
