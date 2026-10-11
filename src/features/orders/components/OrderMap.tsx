import { useMemo } from 'react'

import { MapView, type MapMarker } from '@/components/Map'

import type { Order, OrderTracking } from '../types'
import { vehicleSymbol } from '../vehicleSymbols'

export interface OrderMapProps {
  order: Order
  /** When present and available, the driver is drawn as a third pin. */
  tracking?: OrderTracking | null
  height?: number
}

export function OrderMap({ order, tracking = null, height = 240 }: OrderMapProps) {
  const driverLat = tracking?.available ? tracking.latitude : null
  const driverLng = tracking?.available ? tracking.longitude : null
  const driverStale = tracking?.is_stale ?? false

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
    if (driverLat !== null && driverLng !== null) {
      pins.push({
        id: 'driver',
        position: { latitude: driverLat, longitude: driverLng },
        // Grey once the driver's phone has stopped reporting: that is where
        // they were, not where they are.
        tone: driverStale ? 'default' : 'partner',
        // Drawn as the vehicle that was booked, so the customer knows what
        // to look for.
        symbol: vehicleSymbol(order.vehicle_type),
        // The route is pickup to drop; the driver moves around it.
        route: false,
        label: driverStale ? 'Your driver (last seen)' : 'Your driver',
      })
    }
    return pins
  }, [order.pickup, order.drop, order.vehicle_type, driverLat, driverLng, driverStale])

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
