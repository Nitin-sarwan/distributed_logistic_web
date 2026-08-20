import type { CreateVehiclePayload, UpdateVehiclePayload, Vehicle } from '../types'
import { VehicleCreateForm } from './VehicleCreateForm'
import { VehicleEditForm } from './VehicleEditForm'

export interface VehicleFormProps {
  vehicle?: Vehicle
  onCreate: (payload: CreateVehiclePayload) => Promise<void>
  onUpdate: (id: number, payload: UpdateVehiclePayload) => Promise<void>
  onDone: () => void
  onCancel: () => void
}

export function VehicleForm({
  vehicle,
  onCreate,
  onUpdate,
  onDone,
  onCancel,
}: VehicleFormProps) {
  if (vehicle) {
    return (
      <VehicleEditForm
        vehicle={vehicle}
        onUpdate={onUpdate}
        onDone={onDone}
        onCancel={onCancel}
      />
    )
  }

  return <VehicleCreateForm onCreate={onCreate} onDone={onDone} onCancel={onCancel} />
}
