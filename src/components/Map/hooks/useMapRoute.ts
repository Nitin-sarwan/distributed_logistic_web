import { useEffect, useRef, type RefObject } from 'react'
import L from 'leaflet'

import type { MapMarker } from '../types'
import { toLeaflet } from '../utils'

export function useMapRoute(
  mapRef: RefObject<L.Map | null>,
  markers: MapMarker[],
  enabled: boolean,
): void {
  const lineRef = useRef<L.Polyline | null>(null)

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    lineRef.current?.remove()
    lineRef.current = null

    if (!enabled || markers.length < 2) return

    lineRef.current = L.polyline(
      markers.map((marker) => toLeaflet(marker.position)),
      { className: 'map-route', dashArray: '6 8', weight: 3 },
    ).addTo(map)

    return () => {
      lineRef.current?.remove()
      lineRef.current = null
    }
  }, [mapRef, markers, enabled])
}
