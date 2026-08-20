import axios, { type InternalAxiosRequestConfig } from 'axios'

import { toApiError } from '../errors'
import { audienceForPath, authHeaders, clearSessionToken } from '../sessionTransport'
import { apiClient } from './client'
import { SILENT_401, type RequestOptions } from './requestOptions'
import { emitSessionExpired } from './sessionEvents'

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const headers = authHeaders(audienceForPath(config.url))
  for (const [key, value] of Object.entries(headers)) {
    config.headers.set(key, value)
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const apiError = toApiError(error)

    if (apiError.isUnauthenticated) {
      const config = axios.isAxiosError(error)
        ? (error.config as RequestOptions | undefined)
        : undefined

      const audience = audienceForPath(config?.url)
      clearSessionToken(audience)

      if (!config?.[SILENT_401]) emitSessionExpired(audience)
    }

    return Promise.reject(apiError)
  },
)
