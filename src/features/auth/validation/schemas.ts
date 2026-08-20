import Joi from 'joi'

import { email, password, phone } from './rules'

export interface LoginFormValues {
  email: string
  password: string
}

export const loginSchema = Joi.object<LoginFormValues>({
  email,
  password: Joi.string().required().messages({
    'string.empty': 'Password is required.',
    'any.required': 'Password is required.',
  }),
})

export interface SignupFormValues {
  name: string
  email: string
  phone: string
  password: string
}

export const signupSchema = Joi.object<SignupFormValues>({
  name: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Enter your full name.',
    'any.required': 'Enter your full name.',
    'string.min': 'Enter your full name.',
    'string.max': 'Name must be 100 characters or fewer.',
  }),
  email,
  phone,
  password,
})

export interface ForgotPasswordFormValues {
  email: string
}

export const forgotPasswordSchema = Joi.object<ForgotPasswordFormValues>({ email })

export interface ChangePasswordFormValues {
  current_password: string
  new_password: string
  confirm_password: string
}

export const changePasswordSchema = Joi.object<ChangePasswordFormValues>({
  current_password: Joi.string().required().messages({
    'string.empty': 'Enter your current password.',
    'any.required': 'Enter your current password.',
  }),
  new_password: password.invalid(Joi.ref('current_password')).messages({
    'any.invalid': 'Choose a password different from your current one.',
  }),
  confirm_password: Joi.string().required().valid(Joi.ref('new_password')).messages({
    'string.empty': 'Confirm your new password.',
    'any.required': 'Confirm your new password.',
    'any.only': 'Passwords do not match.',
  }),
})

export interface ResetPasswordFormValues {
  token: string
  new_password: string
  confirm_password: string
}

export const resetPasswordSchema = Joi.object<ResetPasswordFormValues>({
  token: Joi.string().required().messages({
    'string.empty': 'The reset link is missing its token.',
    'any.required': 'The reset link is missing its token.',
  }),
  new_password: password,
  confirm_password: Joi.string().required().valid(Joi.ref('new_password')).messages({
    'string.empty': 'Confirm your new password.',
    'any.required': 'Confirm your new password.',
    'any.only': 'Passwords do not match.',
  }),
})
