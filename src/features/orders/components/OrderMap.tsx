import { useMemo } from 'react'

import { MapView, type MapMarker } from '@/components/Map'

import type { Order } from '../types'

export function OrderMap({ order, height = 240 }: { order: Order; height?: number }) {
  const markers = useMemo<MapMarker[]>(() => {
    const pins: MapMarker[] = [
      {
        id: 'pickup',
        position: { latitude: order.pickup.latitude, longitude: order.pickup.longitude },
        tone: 'pickup',
        label: 'Pickup',
      },
      {
        id: 'drop',
        position: { latitude: order.drop.latitude, longitude: order.drop.longitude },
        tone: 'drop',
        label: 'Drop',
      },
    ]
    return pins
  }, [order.pickup, order.drop])

  return (
    <MapView
      center={{ latitude: order.pickup.latitude, longitude: order.pickup.longitude }}
      markers={markers}
      connectMarkers
      fitMarkers
      height={height}
      ariaLabel={`Map of delivery ${order.public_ref}`}
    />
  )
}
