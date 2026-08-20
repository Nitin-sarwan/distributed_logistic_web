import { useId, useRef } from 'react'

import { cx } from '@/utils'

import { MapControls } from './MapControls'
import { useMapStyle } from './MapStyleContext'
import { useFullscreen } from './hooks/useFullscreen'
import { useLeafletMap } from './hooks/useLeafletMap'
import { useMapMarkers } from './hooks/useMapMarkers'
import { useMapRoute } from './hooks/useMapRoute'
import { useMapTiles } from './hooks/useMapTiles'
import { useMapViewport } from './hooks/useMapViewport'
import { MAP_STYLES } from './tileStyles'
import type { MapViewProps } from './types'

import 'leaflet/dist/leaflet.css'
import './Map.css'

export function MapView({
  center,
  zoom = 15,
  markers = [],
  connectMarkers = false,
  fitMarkers = false,
  interactive = true,
  allowFullscreen = interactive,
  showStyleSwitcher = interactive,
  overlay,
  height = 260,
  className,
  onMoveEnd,
  ariaLabel = 'Map',
}: MapViewProps) {
  const frameRef = useRef<HTMLDivElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const titleId = useId()

  const { style } = useMapStyle()
  const { isExpanded, mode, toggle } = useFullscreen(frameRef)

  const mapRef = useLeafletMap({ containerRef, center, zoom, interactive, onMoveEnd })

  useMapTiles(mapRef, style)
  useMapViewport(mapRef, { center, zoom, markers, fitMarkers })
  useMapMarkers(mapRef, markers)
  useMapRoute(mapRef, markers, connectMarkers)

  return (
    <div
      ref={frameRef}
      className={cx(
        'map-frame',
        !interactive && 'map-frame--static',
        isExpanded && 'map-frame--expanded',
        mode === 'inline' && 'map-frame--overlay',
        className,
      )}
      data-map-style={style}
      style={{
        height: isExpanded ? undefined : toCssSize(height),
        background: MAP_STYLES[style].background,
      }}

      role={interactive ? 'application' : 'img'}
      aria-label={ariaLabel}
      aria-describedby={titleId}
    >

      <span id={titleId} className="map__sr-only">
        {ariaLabel}
      </span>

      <div ref={containerRef} className="map" />

      {overlay}

      <MapControls
        allowFullscreen={allowFullscreen}
        showStyleSwitcher={showStyleSwitcher}
        isExpanded={isExpanded}
        onToggleFullscreen={toggle}
      />
    </div>
  )
}

function toCssSize(value: number | string): string {
  return typeof value === 'number' ? `${value}px` : value
}
