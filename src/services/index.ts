export {
  apiClient,
  get,
  post,
  put,
  patch,
  del,
  getAllowingUnauthenticated,
  onSessionExpired,
} from './http'

export { ApiError, toApiError, errorMessage, isSessionEnded } from './errors'
export type { FieldErrors } from './errors'

export {
  AUTH_TRANSPORT,
  setSessionToken,
  clearSessionToken,
  mayHaveSession,
  audienceForPath,
} from './sessionTransport'
export type { AuthTransport, SessionAudience } from './sessionTransport'
