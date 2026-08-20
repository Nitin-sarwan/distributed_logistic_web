import Joi from 'joi'

import { JOI_OPTIONS } from '@/features/auth/validation'

export { JOI_OPTIONS }

export interface AddressFormValues {
  address_line1: string
  address_line2: string
  city: string
  pin_code: string
  latitude: string
  longitude: string
}

const coordinate = (min: number, max: number, label: string) =>
  Joi.number().min(min).max(max).required().messages({
    'number.base': `${label} is required, and must be a number.`,
    'any.required': `${label} is required.`,
    'number.min': `${label} must be between ${min} and ${max}.`,
    'number.max': `${label} must be between ${min} and ${max}.`,
  })

export const addressSchema = Joi.object<AddressFormValues>({
  address_line1: Joi.string().trim().min(4).max(500).required().messages({
    'string.empty': 'Enter the building, street, or landmark.',
    'any.required': 'Enter the building, street, or landmark.',
    'string.min': 'Enter the building, street, or landmark.',
    'string.max': 'Keep this under 500 characters.',
  }),
  address_line2: Joi.string().trim().max(500).allow('').messages({
    'string.max': 'Keep this under 500 characters.',
  }),
  city: Joi.string()
    .trim()
    .min(2)
    .max(255)
    .required()
    .messages({
      'string.empty': 'Enter a city.',
      'any.required': 'Enter a city.',
      'string.min': 'Enter a city.',
      'string.max': 'Keep this under 255 characters.',
    }),
  pin_code: Joi.string()
    .trim()
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      'string.empty': 'Enter a 6-digit PIN code.',
      'any.required': 'Enter a 6-digit PIN code.',
      'string.pattern.base': 'Enter a 6-digit PIN code.',
    }),
  latitude: coordinate(-90, 90, 'Latitude'),
  longitude: coordinate(-180, 180, 'Longitude'),
})
