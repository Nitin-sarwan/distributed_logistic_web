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
