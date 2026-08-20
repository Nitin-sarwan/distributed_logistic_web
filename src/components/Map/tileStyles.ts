import type { MapStyle, TileStyle } from './types'

const STREET_URL =
  import.meta.env.VITE_MAP_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

const CARTO_ATTRIBUTION = `${OSM_ATTRIBUTION} &copy; <a href="https://carto.com/attributions">CARTO</a>`

export const MAP_STYLES: Record<MapStyle, TileStyle> = {
  street: {
    id: 'street',
    label: 'Street',
    url: STREET_URL,
    attribution: import.meta.env.VITE_MAP_ATTRIBUTION || OSM_ATTRIBUTION,
    maxZoom: 19,
    background: '#e8eaed',
  },
  light: {
    id: 'light',
    label: 'Light',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: CARTO_ATTRIBUTION,
    maxZoom: 20,
    background: '#f2f3f5',
  },
  dark: {
    id: 'dark',
    label: 'Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: CARTO_ATTRIBUTION,
    maxZoom: 20,
    background: '#1b1f27',
  },
}

export const MAP_STYLE_ORDER: MapStyle[] = ['street', 'light', 'dark']

export const DEFAULT_MAP_STYLE: MapStyle = 'street'

export function isMapStyle(value: unknown): value is MapStyle {
  return value === 'street' || value === 'light' || value === 'dark'
}
