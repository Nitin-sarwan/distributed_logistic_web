import { ApiError } from './ApiError'

export function errorMessage(caught: unknown, fallback: string): string {
  return caught instanceof ApiError ? caught.message : fallback
}

export function isSessionEnded(caught: unknown): boolean {
  return caught instanceof ApiError && caught.isUnauthenticated
}
