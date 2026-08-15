import { useCallback, useEffect, useRef, useState } from 'react'

import { ApiError } from '@/services'

import * as addressApi from '../api/addressApi'
import type {
  Address,
  AddressUnavailableReason,
  CreateAddressPayload,
} from '../types'

/**
 * Saved-address state and operations.
 *
 * All the fetching, error handling, and list bookkeeping lives here so the page
 * component stays presentational. No page in this app calls an API module
 * directly.
 */
export interface UseAddressesResult {
  addresses: Address[]
  /** True during the initial load only, so a refresh does not blank the list. */
  isLoading: boolean
  /** A message fit to show a user, or null. */
  error: string | null
  /** Set when the list could not load at all. Distinguishes "not built" from "broke". */
  unavailable: AddressUnavailableReason | null
  isCreating: boolean
  /** Id currently being deleted, so only that row shows a spinner. */
  deletingId: number | null
  create: (payload: CreateAddressPayload) => Promise<void>
  remove: (id: number) => Promise<void>
  refresh: () => Promise<void>
}

export function useAddresses(): UseAddressesResult {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unavailable, setUnavailable] = useState<AddressUnavailableReason | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const isMounted = useRef(true)
  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  const load = useCallback(async () => {
    setError(null)

    try {
      const data = await addressApi.getAddresses()
      if (!isMounted.current) return
      setAddresses(data)
      setUnavailable(null)
    } catch (caught) {
      if (!isMounted.current) return

      const apiError = caught instanceof ApiError ? caught : null

      // A 404 here means the route does not exist, not that the user has no
      // addresses — an empty list would be a 200 with []. Saying "not built
      // yet" points at the right layer instead of sending someone hunting for
      // a frontend bug.
      if (apiError?.isNotFound) {
        setUnavailable('not-implemented')
        setAddresses([])
        return
      }

      // A 401 is already handled globally: the response interceptor clears the
      // credential and the auth store signs the user out. Nothing to add here.
      if (apiError?.isUnauthenticated) return

      setUnavailable('error')
      setError(apiError?.message ?? 'Could not load your saved addresses.')
    } finally {
      if (isMounted.current) setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const create = useCallback(async (payload: CreateAddressPayload) => {
    setIsCreating(true)
    setError(null)

    try {
      const created = await addressApi.createAddress(payload)
      if (!isMounted.current) return
      // Append the server's version rather than the submitted payload — it
      // carries the generated id and any normalisation the backend applied.
      setAddresses((current) => [...current, created])
    } finally {
      if (isMounted.current) setIsCreating(false)
    }
  }, [])

  const remove = useCallback(async (id: number) => {
    setDeletingId(id)
    setError(null)

    try {
      await addressApi.deleteAddress(id)
      if (!isMounted.current) return
      setAddresses((current) => current.filter((address) => address.id !== id))
    } catch (caught) {
      if (!isMounted.current) return
      // Removed optimistically nowhere, so nothing to roll back — the list is
      // still correct, only the message is new.
      setError(
        caught instanceof ApiError ? caught.message : 'Could not delete that address.',
      )
    } finally {
      if (isMounted.current) setDeletingId(null)
    }
  }, [])

  return {
    addresses,
    isLoading,
    error,
    unavailable,
    isCreating,
    deletingId,
    create,
    remove,
    refresh: load,
  }
}
