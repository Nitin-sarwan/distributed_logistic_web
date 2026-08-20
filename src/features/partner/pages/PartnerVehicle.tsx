import { useState } from 'react'

import { Alert } from '@/components/Alert'
import { Button } from '@/components/Button'
import { EmptyState } from '@/components/EmptyState'
import { Loader } from '@/components/Loader'
import { Modal } from '@/components/Modal'

import { VehicleForm } from '../components/VehicleForm'
import { VehicleSections } from '../components/VehicleSections'
import { usePartner } from '../hooks/usePartner'
import { useVehicles } from '../hooks/useVehicles'
import type { Vehicle } from '../types'

import '../components/PartnerUI.css'

export function PartnerVehicle() {
  const { partner } = usePartner()
  const vehicles = useVehicles()

  const [editing, setEditing] = useState<Vehicle | 'new' | null>(null)

  if (vehicles.isLoading) {
    return <Loader fullPage label="Loading your vehicles…" />
  }

  return (
    <div className="partner-page partner-stack">
      <div>
        <h1 className="partner-page__title">My vehicle</h1>
        <p className="partner-page__subtitle">
          Dispatch matches deliveries to what you can carry, so keep this accurate.
        </p>
      </div>

      {vehicles.error && (
        <Alert tone="error">
          {vehicles.error}{' '}
          <button
            type="button"
            className="availability__link-btn"
            onClick={vehicles.dismissError}
          >
            Dismiss
          </button>
        </Alert>
      )}

      {vehicles.vehicles.length === 0 ? (
        <EmptyState
          title="No vehicle added yet"
          description="Add the vehicle you drive. Our team verifies it before you can go online."
          action={<Button onClick={() => setEditing('new')}>Add vehicle</Button>}
        />
      ) : (
        <VehicleSections
          vehicles={vehicles.vehicles}
          activeVehicle={vehicles.activeVehicle}
          busyId={vehicles.busyId}
          isOnTrip={partner?.status === 'on_trip'}
          onAdd={() => setEditing('new')}
          onEdit={setEditing}
          onActivate={(id) => void vehicles.activate(id)}
          onRemove={(id) => void vehicles.remove(id)}
        />
      )}

      <Modal
        isOpen={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'Add a vehicle' : 'Edit vehicle'}
      >
        {editing !== null && (
          <VehicleForm
            vehicle={editing === 'new' ? undefined : editing}
            onCreate={vehicles.create}
            onUpdate={vehicles.update}
            onDone={() => setEditing(null)}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>
    </div>
  )
}
