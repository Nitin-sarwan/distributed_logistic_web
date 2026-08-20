import type { UseFormRegister, FieldErrors } from 'react-hook-form'

import { Input } from '@/components/Input'

import type { AddressFormValues } from '../validation'

export interface AddressFormFieldsProps {
  register: UseFormRegister<AddressFormValues>
  errors: FieldErrors<AddressFormValues>
}

export function AddressFormFields({ register, errors }: AddressFormFieldsProps) {
  return (
    <>
      <Input
        label="Address line 1"
        placeholder="Flat, building, street"
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
    </>
  )
}
