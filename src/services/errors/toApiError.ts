import axios from 'axios'

import { ApiError } from './ApiError'
import { isValidationList, toFieldErrors } from './fieldErrors'
import {
  GENERIC_MESSAGE,
  NETWORK_MESSAGE,
  STATUS_MESSAGES,
  TIMEOUT_MESSAGE,
} from './messages'
import { conflictMessage, partnerMessage, userMessage } from './serviceMessages'

const DETAIL_IS_MESSAGE = ['/api/orders', '/api/deliveries', '/api/dispatch', '/api/pricing']

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error

  if (!axios.isAxiosError(error)) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return canceled()
    }
    return new ApiError('Something went wrong. Please try again.', 0)
  }

  if (axios.isCancel(error) || error.code === 'ERR_CANCELED') return canceled()

  if (!error.response) {
    const message = error.code === 'ECONNABORTED' ? TIMEOUT_MESSAGE : NETWORK_MESSAGE
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
  if (!detailText) {
    return new ApiError(STATUS_MESSAGES[status] ?? GENERIC_MESSAGE, status, {}, null)
  }

  const url = error.config?.url ?? ''

  // These services write their details for the person reading them — "This
  // offer has expired", "A two wheeler carries up to 30 kg" — so the detail is
  // the message. Without this a 409 here fell through to the account-signup
  // wording below and told a driver "That account already exists."
  if (DETAIL_IS_MESSAGE.some((prefix) => url.startsWith(prefix))) {
    return new ApiError(detailText, status, {}, detailText)
  }

  const specific = url.startsWith('/api/partners')
    ? partnerMessage(status, detailText)
    : userMessage(status, detailText)
  if (specific) return specific

  if (status === 409) {
    const { message, fieldErrors } = conflictMessage(detailText)
    return new ApiError(message, 409, fieldErrors, detailText)
  }

  return new ApiError(STATUS_MESSAGES[status] ?? GENERIC_MESSAGE, status, {}, detailText)
}

function canceled(): ApiError {
  return new ApiError('Request cancelled.', 0, {}, null, true)
}
