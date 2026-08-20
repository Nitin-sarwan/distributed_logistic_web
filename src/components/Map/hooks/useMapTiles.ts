import { useEffect, useRef, type RefObject } from 'react'
import L from 'leaflet'

import { MAP_STYLES } from '../tileStyles'
import type { MapStyle } from '../types'

export function useMapTiles(mapRef: RefObject<L.Map | null>, style: MapStyle): void {
  const layerRef = useRef<L.TileLayer | null>(null)

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const definition = MAP_STYLES[style]

    const layer = L.tileLayer(definition.url, {
      attribution: definition.attribution,
      maxZoom: definition.maxZoom,
      detectRetina: definition.url.includes('{r}'),
    }).addTo(map)

    const previous = layerRef.current
    layerRef.current = layer

    if (!previous) return

    const drop = () => previous.remove()
    layer.once('load', drop)

    const timer = window.setTimeout(drop, 1_500)

    return () => window.clearTimeout(timer)
  }, [mapRef, style])
}
