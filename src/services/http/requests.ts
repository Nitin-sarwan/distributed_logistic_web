import type { AxiosRequestConfig } from 'axios'

import { apiClient } from './client'
import { SILENT_401, type RequestOptions } from './requestOptions'

import './interceptors'

export function get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return apiClient.get<T>(url, config).then((response) => response.data)
}

export function post<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  return apiClient.post<T>(url, body, config).then((response) => response.data)
}

export function put<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  return apiClient.put<T>(url, body, config).then((response) => response.data)
}

export function patch<T>(
  url: string,
  body?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  return apiClient.patch<T>(url, body, config).then((response) => response.data)
}

export function del<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return apiClient.delete<T>(url, config).then((response) => response.data)
}

export function getAllowingUnauthenticated<T>(url: string): Promise<T> {
  return get<T>(url, { [SILENT_401]: true } as RequestOptions)
}
