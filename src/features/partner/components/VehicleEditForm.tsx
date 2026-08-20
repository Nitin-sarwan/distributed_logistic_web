import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'

import { Alert } from '@/components/Alert'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { useApiFormErrors } from '@/hooks'

import type { UpdateVehiclePayload, Vehicle } from '../types'
import { JOI_OPTIONS, vehicleEditSchema, type VehicleEditFormValues } from '../validation'

export interface VehicleEditFormProps {
  vehicle: Vehicle
  onUpdate: (id: number, payload: UpdateVehiclePayload) => Promise<void>
  onDone: () => void
  onCancel: () => void
}

const FIELDS = ['capacity', 'model_name'] as const

export function VehicleEditForm({
  vehicle,
  onUpdate,
  onDone,
  onCancel,
}: VehicleEditFormProps) {
  const { formError, clearError, handleError } = useApiFormErrors<VehicleEditFormValues>()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<VehicleEditFormValues>({
    resolver: joiResolver(vehicleEditSchema, JOI_OPTIONS),
    defaultValues: {
      capacity: vehicle.capacity ?? (undefined as unknown as number),
      model_name: vehicle.model_name ?? '',
    },
  })

  const submit = handleSubmit(async (values) => {
    clearError()

    try {
      await onUpdate(vehicle.id, {
        capacity: Number(values.capacity),
        model_name: values.model_name.trim() || null,
      })
      onDone()
    } catch (caught) {
      handleError(caught, setError, [...FIELDS], 'Could not save that vehicle. Try again.')
    }
  })

  return (
    <form className="vehicle-form" onSubmit={submit} noValidate>
      {formError && <Alert tone="error">{formError}</Alert>}

      <p className="vehicle-form__locked">
        Editing <strong>{vehicle.vehicle_number}</strong>. The vehicle type and
        number cannot be changed — add a second vehicle instead.
      </p>

      <Input
        label="Capacity (kg)"
        type="number"
        inputMode="decimal"
        min={1}
        step="any"
        error={errors.capacity?.message}
        {...register('capacity')}
      />

      <Input
        label="Model name (optional)"
        placeholder="e.g. Tata Ace"
        error={errors.model_name?.message}
        {...register('model_name')}
      />

      <div className="vehicle-form__actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting} loadingText="Saving…">
          Save changes
        </Button>
      </div>
    </form>
  )
}
