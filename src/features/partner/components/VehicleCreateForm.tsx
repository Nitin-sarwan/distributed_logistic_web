import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'

import { Alert } from '@/components/Alert'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { useApiFormErrors } from '@/hooks'

import {
  VEHICLE_MAX_CAPACITY,
  VEHICLE_TYPE_LABELS,
  type CreateVehiclePayload,
} from '../types'
import {
  JOI_OPTIONS,
  normalizeVehicleNumber,
  vehicleSchema,
  type VehicleFormValues,
} from '../validation'
import { VehicleTypeSelect } from './VehicleTypeSelect'

export interface VehicleCreateFormProps {
  onCreate: (payload: CreateVehiclePayload) => Promise<void>
  onDone: () => void
  onCancel: () => void
}

const FIELDS = ['vehicle_type', 'vehicle_number', 'capacity', 'model_name'] as const

export function VehicleCreateForm({
  onCreate,
  onDone,
  onCancel,
}: VehicleCreateFormProps) {
  const { formError, clearError, handleError } = useApiFormErrors<VehicleFormValues>()

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormValues>({
    resolver: joiResolver(vehicleSchema, JOI_OPTIONS),
    defaultValues: {
      vehicle_type: 'two_wheeler',
      vehicle_number: '',
      capacity: undefined as unknown as number,
      model_name: '',
    },
  })

  const selectedType = watch('vehicle_type')

  const submit = handleSubmit(async (values) => {
    clearError()

    try {
      await onCreate({
        vehicle_type: values.vehicle_type,
        vehicle_number: normalizeVehicleNumber(values.vehicle_number),
        capacity: Number(values.capacity),
        model_name: values.model_name.trim() || null,
      })
      onDone()
    } catch (caught) {
      handleError(caught, setError, [...FIELDS], 'Could not save that vehicle. Try again.')
    }
  })

  const capacityHint = selectedType
    ? `A ${VEHICLE_TYPE_LABELS[selectedType].toLowerCase()} can be declared up to ${VEHICLE_MAX_CAPACITY[selectedType]} kg.`
    : undefined

  return (
    <form className="vehicle-form" onSubmit={submit} noValidate>
      {formError && <Alert tone="error">{formError}</Alert>}

      <VehicleTypeSelect
        registration={register('vehicle_type')}
        error={errors.vehicle_type?.message}
      />

      <Input
        label="Vehicle number"
        placeholder="RJ14XX1234"
        autoCapitalize="characters"
        hint="Spaces and dashes are ignored."
        error={errors.vehicle_number?.message}
        {...register('vehicle_number')}
      />

      <Input
        label="Capacity (kg)"
        type="number"
        inputMode="decimal"
        min={1}
        step="any"
        hint={capacityHint}
        error={errors.capacity?.message}
        {...register('capacity')}
      />

      <Input
        label="Model name (optional)"
        placeholder="e.g. Honda Activa"
        error={errors.model_name?.message}
        {...register('model_name')}
      />

      <p className="vehicle-form__note">
        New vehicles are checked by our team before they can be used. You will be
        able to select this one once it is verified.
      </p>

      <div className="vehicle-form__actions">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting} loadingText="Adding…">
          Add vehicle
        </Button>
      </div>
    </form>
  )
}
