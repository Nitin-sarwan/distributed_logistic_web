import { useEffect, useRef, type RefObject } from 'react'
import L from 'leaflet'

import type { MapMarker } from '../types'
import { fromLeaflet, pinIcon, toLeaflet } from '../utils'

export function useMapMarkers(
  mapRef: RefObject<L.Map | null>,
  markers: MapMarker[],
): void {
  const liveRef = useRef<Map<string, L.Marker>>(new Map())

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const live = liveRef.current
    const seen = new Set<string>()

    for (const marker of markers) {
      seen.add(marker.id)
      const instance = live.get(marker.id) ?? create(map, marker)
      live.set(marker.id, instance)
      apply(instance, marker)
    }

    for (const [id, instance] of live) {
      if (seen.has(id)) continue
      instance.remove()
      live.delete(id)
    }
  }, [mapRef, markers])

  useEffect(() => () => liveRef.current.clear(), [])
}

function create(map: L.Map, marker: MapMarker): L.Marker {
  return L.marker(toLeaflet(marker.position), {
    icon: pinIcon(marker.tone),
    draggable: marker.draggable ?? false,
    keyboard: false,
    title: marker.label,
    alt: marker.label ?? 'Map pin',
  }).addTo(map)
}

function apply(instance: L.Marker, marker: MapMarker): void {
  instance.setLatLng(toLeaflet(marker.position))
  instance.setIcon(pinIcon(marker.tone))

  const draggable = marker.draggable ?? false
  instance.options.draggable = draggable
  if (draggable) instance.dragging?.enable()
  else instance.dragging?.disable()

  instance.off('dragend')
  if (!marker.onDragEnd) return

  instance.on('dragend', () => {
    marker.onDragEnd?.(fromLeaflet(instance.getLatLng()))
  })
}
