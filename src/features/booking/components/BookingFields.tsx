import { PlaceSearchInput, type Place } from '@/features/geo'

import type { Endpoint } from '../types'

export interface BookingFieldsProps {
  pickup: Endpoint
  drop: Endpoint
  isLocating: boolean
  onPickupText: (text: string) => void
  onDropText: (text: string) => void
  onPickupSelect: (place: Place) => void
  onDropSelect: (place: Place) => void
  onUseCurrentLocation: () => void
}

export function BookingFields({
  pickup,
  drop,
  isLocating,
  onPickupText,
  onDropText,
  onPickupSelect,
  onDropSelect,
  onUseCurrentLocation,
}: BookingFieldsProps) {
  return (
    <div className="booking__locations">

      <div className="booking__route" aria-hidden="true">
        <span className="booking__dot booking__dot--pickup" />
        <span className="booking__line" />
        <span className="booking__dot booking__dot--drop" />
      </div>

      <div className="booking__fields">
        <PlaceSearchInput
          label="Pickup location"
          placeholder="Enter pickup location"
          value={pickup.text}
          onChange={onPickupText}
          onSelect={onPickupSelect}
          near={drop.place}
          trailing={
            <button
              type="button"
              className="booking__locate"
              onClick={onUseCurrentLocation}
              disabled={isLocating}
              title="Use my current location"
            >
              {isLocating ? '…' : '◎'}
              <span className="map__sr-only">Use my current location</span>
            </button>
          }
        />

        <PlaceSearchInput
          label="Drop location"
          placeholder="Enter drop location"
          value={drop.text}
          onChange={onDropText}
          onSelect={onDropSelect}
          near={pickup.place}
        />
      </div>
    </div>
  )
}
