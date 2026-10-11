import type { ReactNode } from 'react'

export interface LatLng {
  latitude: number
  longitude: number
}

export type MapMarkerTone = 'default' | 'pickup' | 'drop' | 'partner'

export interface MapMarker {
  id: string
  position: LatLng
  tone?: MapMarkerTone
  label?: string
  /** False keeps the pin off the dashed route line (default true). */
  route?: boolean
  /**
   * Inner SVG markup for a 24x24 viewBox, drawn with `currentColor` strokes.
   * When set, the marker is a round badge showing this symbol instead of a
   * teardrop pin. The map does not know what the symbol means.
   */
  symbol?: string
  draggable?: boolean
  onDragEnd?: (position: LatLng) => void
}

export type MapStyle = 'street' | 'light' | 'dark'

export interface TileStyle {
  id: MapStyle
  label: string
  url: string
  attribution: string
  maxZoom: number
  background: string
}

export type FullscreenMode = 'none' | 'native' | 'inline'

export interface MapViewProps {
  center: LatLng
  zoom?: number
  markers?: MapMarker[]
  connectMarkers?: boolean
  fitMarkers?: boolean
  interactive?: boolean
  allowFullscreen?: boolean
  showStyleSwitcher?: boolean
  overlay?: ReactNode
  height?: number | string
  className?: string
  onMoveEnd?: (center: LatLng, zoom: number) => void
  ariaLabel?: string
}
