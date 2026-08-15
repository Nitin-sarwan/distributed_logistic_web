import axios from 'axios'

/**
 * Turning backend failures into something a person can act on.
 *
 * Raw backend text is never shown to users. "Email already registered" is a
 * developer's sentence; "An account with this email already exists." is the
 * user's. The mapping lives here so every feature gets the same treatment and
 * no component has to reason about status codes.
 */

/** Field-level messages, keyed by form field name. Populated from 422 responses. */
export type FieldErrors = Record<string, string>

export class ApiError extends Error {
  /** HTTP status, or 0 when the request never reached the gateway. */
  readonly status: number
  /** Per-field messages from a validation failure, for react-hook-form. */
  readonly fieldErrors: FieldErrors
  /** The backend's own wording. For logs and debugging — never rendered. */
  readonly detail: string | null

  constructor(
    message: string,
    status: number,
    fieldErrors: FieldErrors = {},
    detail: string | null = null,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
    this.detail = detail
  }

  /** The session is gone or was never there. Drives the auth state reset. */
  get isUnauthenticated(): boolean {
    return this.status === 401
  }

  /** The endpoint does not exist yet — distinct from "your request was wrong". */
  get isNotFound(): boolean {
    return this.status === 404
  }
}

/** FastAPI's 422 body: `{ detail: [{ loc: ['body', 'email'], msg, type }] }`. */
interface ValidationItem {
  loc?: unknown[]
  msg?: string
  type?: string
}

function isValidationList(detail: unknown): detail is ValidationItem[] {
  return Array.isArray(detail)
}

/**
 * Pull field messages out of a 422 body.
 *
 * `loc` is a path like `['body', 'phone']`; the last segment is the field name,
 * which is exactly what react-hook-form's `setError` wants.
 */
function toFieldErrors(detail: ValidationItem[]): FieldErrors {
  const errors: FieldErrors = {}

  for (const item of detail) {
    const loc = Array.isArray(item.loc) ? item.loc : []
    const field = loc.filter((part) => part !== 'body').pop()
    if (typeof field !== 'string' || !item.msg) continue
    // Pydantic prefixes with "Value error, " when a field_validator raises.
    errors[field] = item.msg.replace(/^Value error,\s*/i, '')
  }

  return errors
}

/**
 * Duplicate-account conflicts.
 *
 * The User Service answers 409 with either "Email already registered" or
 * "Phone already registered". Distinguishing them lets the signup form mark the
 * offending field rather than showing a vague banner.
 */
function conflictMessage(detail: string): { message: string; fieldErrors: FieldErrors } {
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

/** Fallback wording per status, used when nothing more specific applies. */
const STATUS_MESSAGES: Record<number, string> = {
  400: 'We could not process that request. Please check the details and try again.',
  401: 'Your session has ended. Please log in again.',
  403: 'You do not have permission to do that.',
  404: 'We could not find what you were looking for.',
  409: 'That account already exists.',
  422: 'Some of the details are not valid. Please review the form.',
  429: 'Too many attempts. Please wait a moment and try again.',
  500: 'Something went wrong on our side. Please try again shortly.',
  502: 'The service is temporarily unreachable. Please try again shortly.',
  503: 'The service is temporarily unavailable. Please try again shortly.',
  504: 'The request took too long. Please try again.',
}

/**
 * Normalise anything thrown by a request into an `ApiError`.
 *
 * Every feature API function funnels through this, so callers only ever handle
 * one error type and always have a presentable `message`.
 */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error

  if (!axios.isAxiosError(error)) {
    return new ApiError('Something went wrong. Please try again.', 0)
  }

  // No response at all: the gateway is down, DNS failed, or the browser blocked
  // the request. Distinct from any backend answer.
  if (!error.response) {
    const message =
      error.code === 'ECONNABORTED'
        ? 'The request took too long. Please try again.'
        : 'We could not reach the server. Check your connection and try again.'
    return new ApiError(message, 0)
  }

  const { status, data } = error.response
  const detail = (data as { detail?: unknown } | undefined)?.detail

  if (status === 422 && isValidationList(detail)) {
    const fieldErrors = toFieldErrors(detail)
    const first = Object.values(fieldErrors)[0]
    return new ApiError(first ?? STATUS_MESSAGES[422], 422, fieldErrors, null)
  }

  const detailText = typeof detail === 'string' ? detail : null

  if (status === 409 && detailText) {
    const { message, fieldErrors } = conflictMessage(detailText)
    return new ApiError(message, 409, fieldErrors, detailText)
  }

  // Login is the one place the backend's own wording is already the right
  // wording, and rephrasing it would be worse: "Invalid email or password" is
  // deliberately ambiguous so it cannot be used to discover which emails are
  // registered. Keep that ambiguity.
  if (status === 401 && detailText?.toLowerCase().includes('invalid email or password')) {
    return new ApiError('Invalid email or password.', 401, {}, detailText)
  }

  if (status === 401 && detailText?.toLowerCase().includes('current password')) {
    return new ApiError(
      'Your current password is incorrect.',
      401,
      { current_password: 'Incorrect password.' },
      detailText,
    )
  }

  if (status === 400 && detailText?.toLowerCase().includes('reset token')) {
    return new ApiError(
      'This reset link is invalid or has expired. Request a new one.',
      400,
      {},
      detailText,
    )
  }

  const message =
    STATUS_MESSAGES[status] ?? 'Something went wrong. Please try again shortly.'

  return new ApiError(message, status, {}, detailText)
}
