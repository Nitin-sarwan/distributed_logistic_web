import { useEffect, useRef, type RefObject } from 'react'
import L from 'leaflet'

import type { LatLng } from '../types'
import { fromLeaflet, toLeaflet } from '../utils'

export interface UseLeafletMapOptions {
  containerRef: RefObject<HTMLDivElement | null>
  center: LatLng
  zoom: number
  interactive: boolean
  onMoveEnd?: (center: LatLng, zoom: number) => void
}

export function useLeafletMap({
  containerRef,
  center,
  zoom,
  interactive,
  onMoveEnd,
}: UseLeafletMapOptions): RefObject<L.Map | null> {
  const mapRef = useRef<L.Map | null>(null)

  const onMoveEndRef = useRef(onMoveEnd)
  onMoveEndRef.current = onMoveEnd

  const initialRef = useRef({ center, zoom, interactive })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const initial = initialRef.current

    const map = L.map(container, {
      center: toLeaflet(initial.center),
      zoom: initial.zoom,
      scrollWheelZoom: initial.interactive,
      touchZoom: initial.interactive,
      dragging: initial.interactive,
      doubleClickZoom: initial.interactive,
      boxZoom: initial.interactive,
      keyboard: initial.interactive,
      zoomControl: initial.interactive,
      attributionControl: true,
    })

    map.on('moveend', () => {
      onMoveEndRef.current?.(fromLeaflet(map.getCenter()), map.getZoom())
    })

    mapRef.current = map

    const observer = new ResizeObserver(() => map.invalidateSize())
    observer.observe(container)

    return () => {
      observer.disconnect()

      map.remove()
      mapRef.current = null
    }
  }, [containerRef])

  return mapRef
}
