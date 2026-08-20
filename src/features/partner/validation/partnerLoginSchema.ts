import Joi from 'joi'

import { partnerPhone } from './fields'

export interface PartnerLoginFormValues {
  phone: string
  password: string
}

export const partnerLoginSchema = Joi.object<PartnerLoginFormValues>({
  phone: partnerPhone,
  password: Joi.string().required().messages({
    'string.empty': 'Password is required.',
    'any.required': 'Password is required.',
  }),
})
