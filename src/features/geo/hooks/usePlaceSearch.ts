import { useEffect, useRef, useState } from 'react'

import type { LatLng } from '@/components/Map'

import { isAborted, searchPlaces, toSearchError } from '../api/geoApi'
import type { GeoSearchError, Place } from '../types'

const DEBOUNCE_MS = 350

const MIN_QUERY_LENGTH = 3

export interface UsePlaceSearchOptions {
  near?: LatLng | null
  limit?: number
  enabled?: boolean
}

export interface UsePlaceSearchResult {
  results: Place[]
  isSearching: boolean
  error: GeoSearchError | null
  isEmpty: boolean
}

export function usePlaceSearch(
  query: string,
  { near = null, limit, enabled = true }: UsePlaceSearchOptions = {},
): UsePlaceSearchResult {
  const [results, setResults] = useState<Place[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<GeoSearchError | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const nearRef = useRef(near)
  nearRef.current = near

  const trimmed = query.trim()
  const isLongEnough = trimmed.length >= MIN_QUERY_LENGTH

  useEffect(() => {
    if (!enabled || !isLongEnough) {
      setResults([])
      setIsSearching(false)
      setError(null)
      setHasSearched(false)
      return
    }

    const controller = new AbortController()

    setIsSearching(true)

    const timer = window.setTimeout(() => {
      searchPlaces(trimmed, {
        near: nearRef.current,
        limit,
        signal: controller.signal,
      })
        .then((places) => {
          if (controller.signal.aborted) return
          setResults(places)
          setError(null)
          setHasSearched(true)
        })
        .catch((caught: unknown) => {
          if (controller.signal.aborted || isAborted(caught)) return
          setResults([])
          setError(toSearchError(caught))
          setHasSearched(true)
        })
        .finally(() => {
          if (!controller.signal.aborted) setIsSearching(false)
        })
    }, DEBOUNCE_MS)

    return () => {
      window.clearTimeout(timer)

      controller.abort()
    }
  }, [trimmed, isLongEnough, enabled, limit])

  return {
    results,
    isSearching,
    error,
    isEmpty: hasSearched && !isSearching && error === null && results.length === 0,
  }
}
