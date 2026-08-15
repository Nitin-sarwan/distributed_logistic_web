import { useState } from 'react'

import { Alert } from '@/components/Alert'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { EmptyState } from '@/components/EmptyState'
import { Loader } from '@/components/Loader'
import { Modal } from '@/components/Modal'

import { useAddresses } from '../hooks/useAddresses'
import type { CreateAddressPayload } from '../types'
import { AddressCard } from './AddressCard'
import { AddressForm } from './AddressForm'

import './Address.css'

/** A pin, for the empty state. */
function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
      <path
        d="M12 21s7-5.686 7-11a7 7 0 1 0-14 0c0 5.314 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

/**
 * Saved addresses: list, add, delete.
 *
 * Editing is intentionally left out of this first iteration — deleting and
 * re-adding covers the same ground, and the edit flow is better built once the
 * backend routes exist and a real map picker replaces the coordinate fields.
 *
 * The component owns no data logic; `useAddresses` does. It decides only what
 * to render for each state.
 */
export function SavedAddresses() {
  const { addresses, isLoading, error, unavailable, isCreating, deletingId, create, remove } =
    useAddresses()
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleCreate = async (payload: CreateAddressPayload) => {
    await create(payload)
    // Only closes if create() resolved; a failure leaves the form open with the
    // typed values intact.
    setIsFormOpen(false)
  }

  return (
    <Card
      title="Saved addresses"
      description="Save the places you send from and to, so booking a delivery takes seconds."
      action={
        // Always present, so the screen reads the same whether or not the
        // backend is ready — a control that appears only sometimes is harder
        // to trust than one that is visibly unavailable. Disabled while the
        // endpoints are missing, since a POST would only 404; the notice below
        // says why.
        <Button
          onClick={() => setIsFormOpen(true)}
          disabled={isLoading || unavailable === 'not-implemented'}
          title={
            unavailable === 'not-implemented'
              ? 'Available once the User Service exposes its address endpoints.'
              : undefined
          }
        >
          Add address
        </Button>
      }
    >
      {isLoading && <Loader label="Loading addresses…" fullPage />}

      {!isLoading && unavailable === 'not-implemented' && (
        <Alert tone="info">
          Saved addresses aren&apos;t available yet. The User Service has the{' '}
          <code>address</code> table but hasn&apos;t exposed its endpoints — this page
          starts working as soon as it does.
        </Alert>
      )}

      {!isLoading && unavailable === 'error' && error && (
        <div className="stack">
          <Alert tone="error">{error}</Alert>
        </div>
      )}

      {/* An error from a delete, while the list itself is fine. */}
      {!isLoading && !unavailable && error && <Alert tone="error">{error}</Alert>}

      {!isLoading && !unavailable && addresses.length === 0 && (
        <EmptyState
          icon={<PinIcon />}
          title="No saved addresses yet"
          description="Add your home, office, or warehouse and it will be one tap away next time you book."
          action={<Button onClick={() => setIsFormOpen(true)}>Add your first address</Button>}
        />
      )}

      {!isLoading && !unavailable && addresses.length > 0 && (
        <ul className="address-list">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onDelete={remove}
              isDeleting={deletingId === address.id}
            />
          ))}
        </ul>
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Add an address"
        size="lg"
        // A half-filled address is worth protecting from a stray backdrop click.
        closeOnBackdrop={false}
      >
        <AddressForm
          onSubmit={handleCreate}
          onCancel={() => setIsFormOpen(false)}
          isSaving={isCreating}
        />
      </Modal>
    </Card>
  )
}
