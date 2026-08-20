import { useCallback, useEffect, useRef, useState } from 'react'

import { ApiError, errorMessage } from '@/services'

import * as addressApi from '../api/addressApi'
import type {
  Address,
  AddressUnavailableReason,
  CreateAddressPayload,
} from '../types'

export interface UseAddressesResult {
  addresses: Address[]
  isLoading: boolean
  error: string | null
  unavailable: AddressUnavailableReason | null
  isCreating: boolean
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

      if (apiError?.isNotFound) {
        setUnavailable('not-implemented')
        setAddresses([])
        return
      }

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

      setError(errorMessage(caught, 'Could not delete that address.'))
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
