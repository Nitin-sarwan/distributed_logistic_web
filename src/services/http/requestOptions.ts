import type { AxiosRequestConfig } from 'axios'

export const SILENT_401 = Symbol('silent401')

export interface RequestOptions extends AxiosRequestConfig {
  [SILENT_401]?: boolean
}
