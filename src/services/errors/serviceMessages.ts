import { ApiError, type FieldErrors } from './ApiError'

export function conflictMessage(detail: string): {
  message: string
  fieldErrors: FieldErrors
} {
  const lower = detail.toLowerCase()

  if (lower.includes('email')) {
    return {
      message: 'An account with this email already exists. Try logging in instead.',
      fieldErrors: { email: 'This email is already registered.' },
    }
  }

  if (lower.includes('phone')) {
    return {
      message: 'An account with this phone number already exists.',
      fieldErrors: { phone: 'This phone number is already registered.' },
    }
  }

  return { message: 'That account already exists.', fieldErrors: {} }
}

export function partnerMessage(status: number, detail: string): ApiError | null {
  const lower = detail.toLowerCase()

  if (lower.includes('already registered')) return null

  if (status === 409 && lower.includes('registration number')) {
    return new ApiError(
      'That vehicle number is already registered.',
      409,
      { vehicle_number: 'This vehicle number is already registered.' },
      detail,
    )
  }

  if (status === 403 || status === 409) {
    return new ApiError(detail, status, {}, detail)
  }

  if (status === 401 && lower.includes('invalid phone or password')) {
    return new ApiError('Invalid phone number or password.', 401, {}, detail)
  }

  return null
}

export function userMessage(status: number, detail: string): ApiError | null {
  const lower = detail.toLowerCase()

  if (status === 401 && lower.includes('invalid email or password')) {
    return new ApiError('Invalid email or password.', 401, {}, detail)
  }

  if (status === 401 && lower.includes('current password')) {
    return new ApiError(
      'Your current password is incorrect.',
      401,
      { current_password: 'Incorrect password.' },
      detail,
    )
  }

  if (status === 400 && lower.includes('reset token')) {
    return new ApiError(
      'This reset link is invalid or has expired. Request a new one.',
      400,
      {},
      detail,
    )
  }

  return null
}
