import { createContext, useContext, useMemo, type ReactNode } from 'react'

import { useLocalStorage } from '@/hooks/useLocalStorage'

import { DEFAULT_MAP_STYLE, isMapStyle } from './tileStyles'
import type { MapStyle } from './types'

export interface MapStyleContextValue {
  style: MapStyle
  setStyle: (style: MapStyle) => void
  canChangeStyle: boolean
}

const STORAGE_KEY = 'lp.map.style'

const MapStyleContext = createContext<MapStyleContextValue | null>(null)

export function MapStyleProvider({ children }: { children: ReactNode }) {
  const [style, setStyle] = useLocalStorage<MapStyle>(STORAGE_KEY, DEFAULT_MAP_STYLE, {
    validate: isMapStyle,
    serialize: (value) => value,
    deserialize: (raw) => raw,
  })

  const value = useMemo<MapStyleContextValue>(
    () => ({ style, setStyle, canChangeStyle: true }),
    [style, setStyle],
  )

  return <MapStyleContext.Provider value={value}>{children}</MapStyleContext.Provider>
}

export function useMapStyle(): MapStyleContextValue {
  const context = useContext(MapStyleContext)

  return (
    context ?? {
      style: DEFAULT_MAP_STYLE,
      setStyle: () => undefined,
      canChangeStyle: false,
    }
  )
}
