import { useMemo } from 'react'

import { Button } from '@/components/Button'
import { MapView, type MapMarker } from '@/components/Map'
import { formatCoordinates } from '@/features/geo'

import type { Address } from '../types'

import './Address.css'

export interface AddressCardProps {
  address: Address
  onDelete: (id: number) => void
  isDeleting: boolean
}

export function AddressCard({ address, onDelete, isDeleting }: AddressCardProps) {
  const position = { latitude: address.latitude, longitude: address.longitude }

  const markers = useMemo<MapMarker[]>(
    () => [
      {
        id: `address-${address.id}`,
        position: { latitude: address.latitude, longitude: address.longitude },
        label: address.address_line1,
      },
    ],
    [address.id, address.latitude, address.longitude, address.address_line1],
  )

  return (
    <li className="address-card">

      <MapView
        className="address-card__map"
        center={position}
        markers={markers}
        zoom={15}
        interactive={false}
        height={100}
        ariaLabel={`Map showing ${address.address_line1}, ${address.city}`}
      />

      <div className="address-card__body">
        <p className="address-card__line">{address.address_line1}</p>
        {address.address_line2 && (
          <p className="address-card__line address-card__line--muted">
            {address.address_line2}
          </p>
        )}
        <p className="address-card__meta">
          {address.city} · {address.pin_code}
        </p>
        <p className="address-card__coords">

          {formatCoordinates(position)}
        </p>
      </div>

      <Button
        variant="danger"
        size="sm"
        onClick={() => onDelete(address.id)}
        isLoading={isDeleting}
        loadingText="Deleting…"
      >
        Delete
      </Button>
    </li>
  )
}
