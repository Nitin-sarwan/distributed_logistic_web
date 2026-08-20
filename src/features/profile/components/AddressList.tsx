import { Button } from '@/components/Button'
import { EmptyState } from '@/components/EmptyState'
import { PinIcon } from '@/features/geo'

import type { Address } from '../types'
import { AddressCard } from './AddressCard'

import './Address.css'

export interface AddressListProps {
  addresses: Address[]
  deletingId: number | null
  onDelete: (id: number) => void
  onAdd: () => void
}

export function AddressList({
  addresses,
  deletingId,
  onDelete,
  onAdd,
}: AddressListProps) {
  if (addresses.length === 0) {
    return (
      <EmptyState
        icon={<PinIcon />}
        title="No saved addresses yet"
        description="Add your home, office, or warehouse and it will be one tap away next time you book."
        action={<Button onClick={onAdd}>Add your first address</Button>}
      />
    )
  }

  return (
    <ul className="address-list">
      {addresses.map((address) => (
        <AddressCard
          key={address.id}
          address={address}
          onDelete={onDelete}
          isDeleting={deletingId === address.id}
        />
      ))}
    </ul>
  )
}
