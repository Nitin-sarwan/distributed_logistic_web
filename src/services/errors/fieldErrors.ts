import type { FieldErrors } from './ApiError'

interface ValidationItem {
  loc?: unknown[]
  msg?: string
  type?: string
}

export function isValidationList(detail: unknown): detail is ValidationItem[] {
  return Array.isArray(detail)
}

export function toFieldErrors(detail: ValidationItem[]): FieldErrors {
  const errors: FieldErrors = {}

  for (const item of detail) {
    const loc = Array.isArray(item.loc) ? item.loc : []
    const field = loc.filter((part) => part !== 'body').pop()
    if (typeof field !== 'string' || !item.msg) continue

    errors[field] = item.msg.replace(/^Value error,\s*/i, '')
  }

  return errors
}
