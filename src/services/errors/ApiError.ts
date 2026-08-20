export type FieldErrors = Record<string, string>

export class ApiError extends Error {
  readonly status: number

  readonly fieldErrors: FieldErrors

  readonly detail: string | null

  readonly isCanceled: boolean

  constructor(
    message: string,
    status: number,
    fieldErrors: FieldErrors = {},
    detail: string | null = null,
    isCanceled = false,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
    this.detail = detail
    this.isCanceled = isCanceled
  }

  get isUnauthenticated(): boolean {
    return this.status === 401
  }

  get isNotFound(): boolean {
    return this.status === 404
  }
}
