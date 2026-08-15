import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'

import { Alert } from '@/components/Alert'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { ApiError } from '@/services'

import type { CreateAddressPayload } from '../types'
import { JOI_OPTIONS, addressSchema, type AddressFormValues } from '../validation'

import './Address.css'

export interface AddressFormProps {
  onSubmit: (payload: CreateAddressPayload) => Promise<void>
  onCancel: () => void
  isSaving: boolean
}

export function AddressForm({ onSubmit, onCancel, isSaving }: AddressFormProps) {
  const [formError, setFormError] = useState<string | null>(null)
  const [isLocating, setIsLocating] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: joiResolver(addressSchema, JOI_OPTIONS),
    defaultValues: {
      address_line1: '',
      address_line2: '',
      city: '',
      pin_code: '',
      latitude: '',
      longitude: '',
    },
  })

  /**
   * Fill the coordinates from the device.
   *
   * The table requires latitude and longitude, and asking someone to look up
   * their own coordinates is not a reasonable thing to ask. This is the browser
   * Geolocation API — no mapping library, no extra dependency. A real map
   * picker belongs with the Location Service, later.
   */
  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setFormError('Your browser cannot share a location. Enter the coordinates manually.')
      return
    }

    setIsLocating(true)
    setFormError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue('latitude', position.coords.latitude.toFixed(6), {
          shouldValidate: true,
        })
        setValue('longitude', position.coords.longitude.toFixed(6), {
          shouldValidate: true,
        })
        setIsLocating(false)
      },
      () => {
        // Covers refusal, unavailability, and timeout alike — the user's next
        // step is the same in every case.
        setFormError(
          'We could not read your location. Allow location access, or enter the coordinates manually.',
        )
        setIsLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10_000 },
    )
  }

  const submit = handleSubmit(async (values) => {
    setFormError(null)

    try {
      await onSubmit({
        address_line1: values.address_line1.trim(),
        // null, not "", so an omitted line is genuinely absent in the column.
        address_line2: values.address_line2?.trim() || null,
        city: values.city.trim(),
        pin_code: values.pin_code.trim(),
        // Strings from the inputs; the column is numeric.
        latitude: Number(values.latitude),
        longitude: Number(values.longitude),
      })
    } catch (error) {
      setFormError(
        error instanceof ApiError ? error.message : 'Could not save this address.',
      )
    }
  })

  return (
    <form className="address-form" onSubmit={submit} noValidate>
      {formError && <Alert tone="error">{formError}</Alert>}

      <Input
        label="Address line 1"
        placeholder="Flat, building, street"
        autoFocus
        error={errors.address_line1?.message}
        {...register('address_line1')}
      />

      <Input
        label="Address line 2"
        placeholder="Area, landmark (optional)"
        error={errors.address_line2?.message}
        {...register('address_line2')}
      />

      <div className="address-form__row">
        <Input
          label="City"
          placeholder="Bengaluru"
          error={errors.city?.message}
          {...register('city')}
        />
        <Input
          label="PIN code"
          inputMode="numeric"
          maxLength={6}
          placeholder="560001"
          error={errors.pin_code?.message}
          {...register('pin_code')}
        />
      </div>

      <div className="address-form__coords">
        <div className="address-form__row">
          <Input
            label="Latitude"
            inputMode="decimal"
            placeholder="12.971599"
            error={errors.latitude?.message}
            {...register('latitude')}
          />
          <Input
            label="Longitude"
            inputMode="decimal"
            placeholder="77.594566"
            error={errors.longitude?.message}
            {...register('longitude')}
          />
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={useCurrentLocation}
          isLoading={isLocating}
          loadingText="Locating…"
        >
          Use my current location
        </Button>
        <p className="address-form__note">
          Coordinates let your delivery partner find the exact pickup point.
        </p>
      </div>

      <div className="address-form__actions">
        <Button variant="secondary" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSaving} loadingText="Saving address…">
          Save address
        </Button>
      </div>
    </form>
  )
}
