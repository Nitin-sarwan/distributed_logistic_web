import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'

import type { LatLng } from '@/components/Map'
import type { PickedLocation, Place } from '@/features/geo'
import { errorMessage } from '@/services'

import type { CreateAddressPayload } from '../types'
import { JOI_OPTIONS, addressSchema, type AddressFormValues } from '../validation'
import { toLatLng, toPayload } from '../utils'

export interface UseAddressFormOptions {
  onSubmit: (payload: CreateAddressPayload) => Promise<void>
}

export function useAddressForm({ onSubmit }: UseAddressFormOptions) {
  const [formError, setFormError] = useState<string | null>(null)
  const [searchText, setSearchText] = useState('')

  const form = useForm<AddressFormValues>({
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

  const { getValues, setValue, watch } = form

  const pin = toLatLng(watch('latitude'), watch('longitude'))

  const setCoordinates = useCallback(
    ({ latitude, longitude }: LatLng) => {
      setValue('latitude', latitude.toFixed(6), { shouldValidate: true })
      setValue('longitude', longitude.toFixed(6), { shouldValidate: true })
    },
    [setValue],
  )

  const applyPlace = useCallback(
    (place: Place, { overwrite }: { overwrite: boolean }) => {
      const fill = (field: keyof AddressFormValues, value: string | null) => {
        if (!value) return
        if (!overwrite && getValues(field)) return
        setValue(field, value, { shouldValidate: true })
      }

      fill('address_line1', place.address_line1)
      fill('address_line2', place.address_line2)
      fill('city', place.city)

      fill('pin_code', place.pin_code)
    },
    [getValues, setValue],
  )

  const handlePlaceSelected = useCallback(
    (place: Place) => {
      setSearchText(place.label)
      setCoordinates(place)
      applyPlace(place, { overwrite: true })
      setFormError(null)
    },
    [applyPlace, setCoordinates],
  )

  const handlePinChange = useCallback(
    (picked: PickedLocation) => {
      setCoordinates(picked)
      if (picked.place) applyPlace(picked.place, { overwrite: false })
    },
    [applyPlace, setCoordinates],
  )

  const submit = form.handleSubmit(async (values) => {
    setFormError(null)

    try {
      await onSubmit(toPayload(values))
    } catch (error) {
      setFormError(errorMessage(error, 'Could not save this address.'))
    }
  })

  return {
    form,
    pin,
    searchText,
    setSearchText,
    formError,
    handlePlaceSelected,
    handlePinChange,
    submit,
  }
}
