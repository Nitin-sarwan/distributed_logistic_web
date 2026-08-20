import Joi from 'joi'

import { VEHICLE_MAX_CAPACITY, type VehicleType } from '../types'

export interface VehicleFormValues {
  vehicle_type: VehicleType
  vehicle_number: string
  capacity: number
  model_name: string
}

export function normalizeVehicleNumber(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
}

const vehicleType = Joi.string()
  .valid('two_wheeler', 'three_wheeler', 'mini_truck', 'truck')
  .required()
  .messages({
    'any.only': 'Choose a vehicle type.',
    'any.required': 'Choose a vehicle type.',
    'string.empty': 'Choose a vehicle type.',
  })

const vehicleNumber = Joi.string()
  .custom((value: string) => normalizeVehicleNumber(value))
  .min(4)
  .max(20)
  .required()
  .messages({
    'string.empty': 'Enter the vehicle number.',
    'any.required': 'Enter the vehicle number.',
    'string.min': 'A vehicle number needs at least 4 letters or digits.',
    'string.max': 'A vehicle number can be at most 20 letters or digits.',
  })

const capacity = Joi.number()
  .greater(0)
  .required()
  .custom((value: number, helpers) => {
    const type = (helpers.state.ancestors[0] as VehicleFormValues | undefined)
      ?.vehicle_type
    const max = type ? VEHICLE_MAX_CAPACITY[type] : undefined

    if (max !== undefined && value > max) {
      return helpers.error('capacity.overType', { max })
    }
    return value
  })
  .messages({
    'number.base': 'Enter the capacity in kilograms.',
    'number.greater': 'Capacity must be more than 0 kg.',
    'any.required': 'Enter the capacity in kilograms.',
    'capacity.overType': 'This vehicle type is limited to {{#max}} kg.',
  })

export const vehicleSchema = Joi.object<VehicleFormValues>({
  vehicle_type: vehicleType,
  vehicle_number: vehicleNumber,
  capacity,
  model_name: Joi.string().trim().max(100).allow('').optional().messages({
    'string.max': 'Model name must be 100 characters or fewer.',
  }),
})

export interface VehicleEditFormValues {
  capacity: number
  model_name: string
}

export const vehicleEditSchema = Joi.object<VehicleEditFormValues>({
  capacity: Joi.number().greater(0).required().messages({
    'number.base': 'Enter the capacity in kilograms.',
    'number.greater': 'Capacity must be more than 0 kg.',
    'any.required': 'Enter the capacity in kilograms.',
  }),
  model_name: Joi.string().trim().max(100).allow('').optional().messages({
    'string.max': 'Model name must be 100 characters or fewer.',
  }),
})
