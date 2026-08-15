import Joi from 'joi'

import { JOI_OPTIONS } from '@/features/auth/validation'

export { JOI_OPTIONS }

/**
 * Address form rules, matching the `address` table's column constraints so the
 * form cannot pass locally and then fail on insert.
 */

export interface AddressFormValues {
  address_line1: string
  address_line2: string
  city: string
  pin_code: string
  /**
   * Held as strings because they come from text inputs. Joi converts them to
   * numbers during validation, which is what makes the range checks below
   * meaningful; the submit handler coerces explicitly regardless.
   */
  latitude: string
  longitude: string
}

/** A coordinate typed into a text field: must parse as a number and be in range. */
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

  // Optional, and an empty string is a legitimate "not given" rather than a
  // validation failure — the column is nullable.
  address_line2: Joi.string().trim().max(500).allow('').messages({
    'string.max': 'Keep this under 500 characters.',
  }),

  city: Joi.string()
    .trim()
    .min(2)
    // VARCHAR(255) in the table.
    .max(255)
    .required()
    .messages({
      'string.empty': 'Enter a city.',
      'any.required': 'Enter a city.',
      'string.min': 'Enter a city.',
      'string.max': 'Keep this under 255 characters.',
    }),

  // VARCHAR(6): Indian PIN codes are exactly six digits.
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
