import type { LatLng } from '@/components/Map'

import type { Place } from '../types'
import { formatCoordinates, shortLabel } from '../utils'

export interface LocationReadoutProps {
  center: LatLng
  hasPoint: boolean
  place: Place | null
  isResolving: boolean
}

export function LocationReadout({
  center,
  hasPoint,
  place,
  isResolving,
}: LocationReadoutProps) {
  return (
    <div className="location-picker__readout">
      <p className="location-picker__address">{describe(hasPoint, place, isResolving)}</p>
      {hasPoint && <p className="location-picker__coords">{formatCoordinates(center)}</p>}
    </div>
  )
}

function describe(hasPoint: boolean, place: Place | null, isResolving: boolean): string {
  if (!hasPoint) return 'Drag the map to put the pin on your exact spot.'
  if (place) return shortLabel(place)
  if (isResolving) return 'Looking up this spot…'
  return 'Pin placed. No address is mapped here — the coordinates are what the driver needs.'
}
