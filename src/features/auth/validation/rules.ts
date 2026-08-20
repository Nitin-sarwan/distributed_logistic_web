import Joi from 'joi'

export const JOI_OPTIONS: Joi.ValidationOptions = {
  abortEarly: false,
  convert: true,
  allowUnknown: false,
  stripUnknown: false,
}

export const email = Joi.string()
  .trim()
  .lowercase()
  .email({ tlds: { allow: false } })
  .required()
  .messages({
    'string.empty': 'Email is required.',
    'any.required': 'Email is required.',
    'string.email': 'Enter a valid email address.',
  })

export const password = Joi.string()
  .min(8)
  .max(128)
  .pattern(/[a-zA-Z]/, 'letter')
  .pattern(/\d/, 'number')
  .required()
  .messages({
    'string.empty': 'Password is required.',
    'any.required': 'Password is required.',
    'string.min': 'Use at least 8 characters.',
    'string.max': 'Use no more than 128 characters.',
    'string.pattern.name': 'Include at least one {#name}.',
  })

export const phone = Joi.string()
  .trim()
  .pattern(/^\d{10}$/)
  .required()
  .messages({
    'string.empty': 'Phone number is required.',
    'any.required': 'Phone number is required.',
    'string.pattern.base': 'Enter a 10-digit phone number.',
  })

