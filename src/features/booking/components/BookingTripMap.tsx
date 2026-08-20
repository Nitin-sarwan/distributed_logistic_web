import { MapView, type LatLng, type MapMarker } from '@/components/Map'
import { formatDistance } from '@/features/geo'

export interface BookingTripMapProps {
  center: LatLng | null
  markers: MapMarker[]
  straightLineKm: number | null
}

export function BookingTripMap({ center, markers, straightLineKm }: BookingTripMapProps) {
  if (!center) return null

  return (
    <>
      <div className="booking__map">
        <MapView
          center={center}
          markers={markers}
          connectMarkers

          fitMarkers
          zoom={15}
          height={200}
          ariaLabel="Map of the pickup and drop locations"
        />
      </div>

      {straightLineKm !== null && (
        <p className="booking__distance">
          {formatDistance(straightLineKm)} apart

          <span className="booking__distance-note"> · as the crow flies</span>
        </p>
      )}
    </>
  )
}
