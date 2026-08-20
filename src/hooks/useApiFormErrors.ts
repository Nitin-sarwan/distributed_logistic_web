import { useCallback, useState } from 'react'
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'

import { ApiError } from '@/services'

export interface UseApiFormErrorsResult<T extends FieldValues> {
  formError: string | null
  clearError: () => void
  handleError: (
    caught: unknown,
    setError: UseFormSetError<T>,
    fields: Path<T>[],
    fallback?: string,
  ) => void
}

export function useApiFormErrors<T extends FieldValues>(): UseApiFormErrorsResult<T> {
  const [formError, setFormError] = useState<string | null>(null)

  const handleError = useCallback(
    (
      caught: unknown,
      setError: UseFormSetError<T>,
      fields: Path<T>[],
      fallback = 'Something went wrong. Try again.',
    ) => {
      const apiError = caught instanceof ApiError ? caught : null

      for (const [field, message] of Object.entries(apiError?.fieldErrors ?? {})) {
        if (fields.includes(field as Path<T>)) {
          setError(field as Path<T>, { message })
        }
      }

      setFormError(apiError?.message ?? fallback)
    },
    [],
  )

  return { formError, clearError: useCallback(() => setFormError(null), []), handleError }
}
