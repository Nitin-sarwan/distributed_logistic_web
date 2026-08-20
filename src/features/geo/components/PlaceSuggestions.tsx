import { cx } from '@/utils'

import type { GeoSearchError, Place } from '../types'
import { labelContext, shortLabel } from '../utils'

export interface PlaceSuggestionsProps {
  id: string
  results: Place[]
  activeIndex: number
  isSearching: boolean
  isEmpty: boolean
  error: GeoSearchError | null
  onHighlight: (index: number) => void
  onChoose: (place: Place) => void
}

const ERROR_COPY: Record<GeoSearchError, string> = {
  'rate-limited':
    'Too many searches just now. Wait a moment, or place the pin on the map.',
  unavailable: 'Address search is unavailable. Place the pin on the map instead.',
}

export function PlaceSuggestions({
  id,
  results,
  activeIndex,
  isSearching,
  isEmpty,
  error,
  onHighlight,
  onChoose,
}: PlaceSuggestionsProps) {
  return (
    <ul className="place-search__list" id={id} role="listbox" aria-label="Address suggestions">
      {isSearching && results.length === 0 && <Status>Searching…</Status>}

      {error && <Status>{ERROR_COPY[error]}</Status>}

      {isEmpty && !error && <Status>No matches. Try a landmark or a nearby road.</Status>}

      {results.map((place, index) => (
        <li
          key={place.place_id}
          id={`${id}-option-${index}`}
          role="option"
          aria-selected={index === activeIndex}
          className={cx(
            'place-search__option',
            index === activeIndex && 'place-search__option--active',
          )}

          onMouseDown={(event) => {
            event.preventDefault()
            onChoose(place)
          }}
          onMouseEnter={() => onHighlight(index)}
        >
          <span className="place-search__option-main">{shortLabel(place)}</span>
          {labelContext(place) && (
            <span className="place-search__option-context">{labelContext(place)}</span>
          )}
        </li>
      ))}
    </ul>
  )
}

function Status({ children }: { children: React.ReactNode }) {
  return (
    <li className="place-search__status" role="presentation">
      {children}
    </li>
  )
}
