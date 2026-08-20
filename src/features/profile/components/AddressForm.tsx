import { Alert } from '@/components/Alert'
import { Button } from '@/components/Button'
import { LocationPicker, PlaceSearchInput } from '@/features/geo'

import { useAddressForm } from '../hooks/useAddressForm'
import type { CreateAddressPayload } from '../types'
import { AddressCoordinateFields } from './AddressCoordinateFields'
import { AddressFormFields } from './AddressFormFields'

import './Address.css'

export interface AddressFormProps {
  onSubmit: (payload: CreateAddressPayload) => Promise<void>
  onCancel: () => void
  isSaving: boolean
}

export function AddressForm({ onSubmit, onCancel, isSaving }: AddressFormProps) {
  const {
    form: {
      register,
      formState: { errors },
    },
    pin,
    searchText,
    setSearchText,
    formError,
    handlePlaceSelected,
    handlePinChange,
    submit,
  } = useAddressForm({ onSubmit })

  return (
    <form className="address-form" onSubmit={submit} noValidate>
      {formError && <Alert tone="error">{formError}</Alert>}

      <PlaceSearchInput
        label="Find the address"
        placeholder="Search a building, street, or landmark"
        value={searchText}
        onChange={setSearchText}
        onSelect={handlePlaceSelected}

        near={pin}
        hint="Search, or drag the map below to place the pin exactly."
        autoFocus
      />

      <div className="address-form__map">
        <LocationPicker value={pin} onChange={handlePinChange} height={260} />
      </div>

      <AddressFormFields register={register} errors={errors} />

      <AddressCoordinateFields register={register} errors={errors} />

      {(errors.latitude || errors.longitude) && (
        <Alert tone="warning">
          Place the pin on the map before saving — a delivery point needs
          coordinates, not just a street name.
        </Alert>
      )}

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
