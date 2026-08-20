import { DEFAULT_CENTER, MapView, type LatLng } from '@/components/Map'

import { useLocationPicker } from '../hooks/useLocationPicker'
import type { PickedLocation } from '../types'
import { LocationPickerOverlay } from './LocationPickerOverlay'
import { LocationReadout } from './LocationReadout'

import './Geo.css'

export interface LocationPickerProps {
  value: LatLng | null
  onChange: (picked: PickedLocation) => void
  fallbackCenter?: LatLng
  height?: number
  zoom?: number
  autoLocate?: boolean
  className?: string
}

export function LocationPicker({
  value,
  onChange,
  fallbackCenter = DEFAULT_CENTER,
  height = 280,
  zoom = 16,
  autoLocate = false,
  className,
}: LocationPickerProps) {
  const picker = useLocationPicker({ value, onChange, fallbackCenter, autoLocate })

  return (
    <div className={className}>
      <div className="location-picker">
        <MapView
          center={picker.center}
          zoom={zoom}
          height={height}
          onMoveEnd={picker.handleMoveEnd}
          ariaLabel="Drag the map to place the pin"
          overlay={
            <LocationPickerOverlay
              isLocating={picker.isLocating}
              onUseMyLocation={() => void picker.useMyLocation()}
            />
          }
        />
      </div>

      <LocationReadout
        center={picker.center}
        hasPoint={picker.hasPoint}
        place={picker.place}
        isResolving={picker.isResolving}
      />

      {picker.locationError && (
        <p className="location-picker__error">{picker.locationError}</p>
      )}
    </div>
  )
}
