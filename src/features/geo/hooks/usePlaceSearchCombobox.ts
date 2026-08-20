import { useCallback, useRef, useState } from 'react'

import type { LatLng } from '@/components/Map'
import { useCombobox, type UseComboboxResult } from '@/hooks'

import type { GeoSearchError, Place } from '../types'
import { usePlaceSearch } from './usePlaceSearch'

export interface UsePlaceSearchComboboxOptions {
  value: string
  onChange: (value: string) => void
  onSelect: (place: Place) => void
  near?: LatLng | null
}

export interface UsePlaceSearchComboboxResult extends UseComboboxResult<Place> {
  results: Place[]
  isSearching: boolean
  isEmpty: boolean
  error: GeoSearchError | null
  showList: boolean
  handleChange: (value: string) => void
  handleFocus: () => void
}

export const MIN_QUERY_LENGTH = 3

export function usePlaceSearchCombobox({
  value,
  onChange,
  onSelect,
  near = null,
}: UsePlaceSearchComboboxOptions): UsePlaceSearchComboboxResult {
  const [isOpen, setOpen] = useState(false)

  const justSelected = useRef(false)

  const { results, isSearching, isEmpty, error } = usePlaceSearch(value, {
    near,
    enabled: isOpen,
  })

  const handleSelect = useCallback(
    (place: Place) => {
      justSelected.current = true
      onSelect(place)
    },
    [onSelect],
  )

  const combobox = useCombobox<Place>({
    items: results,
    isOpen,
    setOpen,
    onSelect: handleSelect,
  })

  const handleChange = useCallback(
    (next: string) => {
      onChange(next)
      if (justSelected.current) {
        justSelected.current = false
        return
      }
      combobox.open()
    },
    [combobox, onChange],
  )

  const handleFocus = useCallback(() => {
    if (value.trim().length >= MIN_QUERY_LENGTH) combobox.open()
  }, [combobox, value])

  return {
    ...combobox,
    results,
    isSearching,
    isEmpty,
    error,
    showList: isOpen && (results.length > 0 || isSearching || isEmpty || Boolean(error)),
    handleChange,
    handleFocus,
  }
}
