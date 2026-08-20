import { useEffect, type RefObject } from 'react'
import L from 'leaflet'

import type { LatLng, MapMarker } from '../types'
import { fromLeaflet, isSamePoint, toLeaflet } from '../utils'

export interface UseMapViewportOptions {
  center: LatLng
  zoom: number
  markers: MapMarker[]
  fitMarkers: boolean
}

export function useMapViewport(
  mapRef: RefObject<L.Map | null>,
  { center, zoom, markers, fitMarkers }: UseMapViewportOptions,
): void {
  const isFitting = fitMarkers && markers.length > 1

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    if (isSamePoint(fromLeaflet(map.getCenter()), center)) return

    map.setView(toLeaflet(center), map.getZoom(), { animate: true })
  }, [mapRef, center])

  useEffect(() => {
    if (isFitting) return
    mapRef.current?.setZoom(zoom)
  }, [mapRef, zoom, isFitting])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !isFitting) return

    map.fitBounds(markers.map((marker) => toLeaflet(marker.position)), {
      padding: [40, 40],
      maxZoom: 16,
    })
  }, [mapRef, markers, isFitting])
}
