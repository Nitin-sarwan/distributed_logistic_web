export const STATUS_MESSAGES: Record<number, string> = {
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

export const GENERIC_MESSAGE = 'Something went wrong. Please try again shortly.'

export const NETWORK_MESSAGE =
  'We could not reach the server. Check your connection and try again.'

export const TIMEOUT_MESSAGE = 'The request took too long. Please try again.'
