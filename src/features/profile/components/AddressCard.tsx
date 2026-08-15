import { Button } from '@/components/Button'

import type { Address } from '../types'

import './Address.css'

export interface AddressCardProps {
  address: Address
  onDelete: (id: number) => void
  isDeleting: boolean
}

export function AddressCard({ address, onDelete, isDeleting }: AddressCardProps) {
  return (
    <li className="address-card">
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
          {/* Six decimals matches NUMERIC(9,6) — roughly 10 cm, which is the
              precision a driver's pin actually needs. */}
          {address.latitude.toFixed(6)}, {address.longitude.toFixed(6)}
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
