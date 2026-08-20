import { useId, type ReactNode } from 'react'

import type { LatLng } from '@/components/Map'
import { cx } from '@/utils'

import { usePlaceSearchCombobox, MIN_QUERY_LENGTH } from '../hooks/usePlaceSearchCombobox'
import type { Place } from '../types'
import { SearchIcon } from './GeoIcons'
import { PlaceSuggestions } from './PlaceSuggestions'

import './Geo.css'

export interface PlaceSearchInputProps {
  label?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onSelect: (place: Place) => void
  near?: LatLng | null
  error?: string
  hint?: string
  autoFocus?: boolean
  id?: string
  className?: string
  trailing?: ReactNode
}

export function PlaceSearchInput({
  label,
  placeholder = 'Search for an address',
  value,
  onChange,
  onSelect,
  near = null,
  error,
  hint,
  autoFocus,
  id,
  className,
  trailing,
}: PlaceSearchInputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const listId = `${inputId}-listbox`
  const messageId = `${inputId}-message`

  const search = usePlaceSearchCombobox({ value, onChange, onSelect, near })

  return (
    <div className={cx('field', 'place-search', error && 'field--invalid', className)}>
      {label && (
        <label className="field__label" htmlFor={inputId}>
          {label}
        </label>
      )}

      <div className="place-search__box" ref={search.containerRef}>
        <div className="field__control">
          <span className="field__prefix" aria-hidden="true">
            <SearchIcon />
          </span>

          <input
            id={inputId}
            className="field__input"
            type="text"
            role="combobox"
            aria-expanded={search.showList}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={
              search.activeIndex >= 0 ? `${listId}-option-${search.activeIndex}` : undefined
            }

            autoComplete="off"
            autoFocus={autoFocus}
            placeholder={placeholder}
            minLength={MIN_QUERY_LENGTH}
            value={value}
            onChange={(event) => search.handleChange(event.target.value)}
            onFocus={search.handleFocus}
            onKeyDown={search.handleKeyDown}
            aria-invalid={error ? true : undefined}
            aria-describedby={error || hint ? messageId : undefined}
          />

          {trailing && <span className="place-search__trailing">{trailing}</span>}
        </div>

        {search.showList && (
          <PlaceSuggestions
            id={listId}
            results={search.results}
            activeIndex={search.activeIndex}
            isSearching={search.isSearching}
            isEmpty={search.isEmpty}
            error={search.error}
            onHighlight={search.setActiveIndex}
            onChoose={search.select}
          />
        )}
      </div>

      {(error || hint) && (
        <p
          id={messageId}
          className={cx('field__message', error && 'field__message--error')}
          role={error ? 'alert' : undefined}
        >
          {error ?? hint}
        </p>
      )}

      <span className="map__sr-only" role="status" aria-live="polite">
        {search.showList && search.results.length > 0
          ? `${search.results.length} suggestions available`
          : ''}
      </span>
    </div>
  )
}
