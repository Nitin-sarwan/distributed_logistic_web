export type Nullable<T> = T | null

export type Id = number

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error'

export interface AsyncState<T> {
  data: T
  isLoading: boolean
  error: Nullable<string>
}
