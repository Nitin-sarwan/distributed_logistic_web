import { useState } from 'react'

import { Alert } from '@/components/Alert'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Loader } from '@/components/Loader'
import { Modal } from '@/components/Modal'

import { useAddresses } from '../hooks/useAddresses'
import type { CreateAddressPayload } from '../types'
import { AddressForm } from './AddressForm'
import { AddressList } from './AddressList'

import './Address.css'

export function SavedAddresses() {
  const {
    addresses,
    isLoading,
    error,
    unavailable,
    isCreating,
    deletingId,
    create,
    remove,
  } = useAddresses()
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleCreate = async (payload: CreateAddressPayload) => {
    await create(payload)

    setIsFormOpen(false)
  }

  const isUnavailable = unavailable === 'not-implemented'

  return (
    <Card
      title="Saved addresses"
      description="Save the places you send from and to, so booking a delivery takes seconds."
      action={
        <Button
          onClick={() => setIsFormOpen(true)}
          disabled={isLoading || isUnavailable}
          title={
            isUnavailable
              ? 'Unavailable while the address endpoints cannot be reached.'
              : undefined
          }
        >
          Add address
        </Button>
      }
    >
      {isLoading && <Loader label="Loading addresses…" fullPage />}

      {!isLoading && isUnavailable && (
        <Alert tone="info">
          Saved addresses aren&apos;t reachable. The User Service isn&apos;t exposing
          its address endpoints — check it is running the current code and that the
          address migration has been applied.
        </Alert>
      )}

      {!isLoading && !isUnavailable && error && <Alert tone="error">{error}</Alert>}

      {!isLoading && !unavailable && (
        <AddressList
          addresses={addresses}
          deletingId={deletingId}
          onDelete={remove}
          onAdd={() => setIsFormOpen(true)}
        />
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Add an address"
        size="lg"

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
