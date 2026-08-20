import type { UseFormRegisterReturn } from 'react-hook-form'

import { VEHICLE_MAX_CAPACITY, VEHICLE_TYPE_LABELS, type VehicleType } from '../types'

const VEHICLE_TYPES = Object.keys(VEHICLE_TYPE_LABELS) as VehicleType[]

export interface VehicleTypeSelectProps {
  registration: UseFormRegisterReturn
  error?: string
}

export function VehicleTypeSelect({ registration, error }: VehicleTypeSelectProps) {
  return (
    <div className="field">
      <label className="field__label" htmlFor="vehicle-type">
        Vehicle type
      </label>

      <div className="field__control">
        <select
          id="vehicle-type"
          className="field__input vehicle-form__select"
          {...registration}
        >
          {VEHICLE_TYPES.map((type) => (
            <option key={type} value={type}>
              {VEHICLE_TYPE_LABELS[type]} — up to {VEHICLE_MAX_CAPACITY[type]} kg
            </option>
          ))}
        </select>
      </div>

      {error && <p className="field__message field__message--error">{error}</p>}
    </div>
  )
}
