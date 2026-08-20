import type { UseFormRegister, FieldErrors } from 'react-hook-form'

import { Input } from '@/components/Input'

import type { AddressFormValues } from '../validation'

export interface AddressCoordinateFieldsProps {
  register: UseFormRegister<AddressFormValues>
  errors: FieldErrors<AddressFormValues>
}

export function AddressCoordinateFields({
  register,
  errors,
}: AddressCoordinateFieldsProps) {
  return (
    <details className="address-form__coords-toggle">
      <summary>Enter coordinates manually</summary>

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

      <p className="address-form__note">
        The map keeps these in step. Type here only to paste a pin someone gave
        you — the map will move to match.
      </p>
    </details>
  )
}
