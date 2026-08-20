import Joi from 'joi'

import { optionalEmail, partnerName, partnerPassword, partnerPhone } from './fields'

export interface PartnerSignupFormValues {
  name: string
  phone: string
  email: string
  password: string
}

export const partnerSignupSchema = Joi.object<PartnerSignupFormValues>({
  name: partnerName,
  phone: partnerPhone,
  email: optionalEmail,
  password: partnerPassword,
})
