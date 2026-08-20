import { useCallback, useState } from 'react'

export interface UseLocalStorageOptions<T> {
  validate?: (value: unknown) => value is T
  serialize?: (value: T) => string
  deserialize?: (raw: string) => unknown
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {},
): [T, (value: T) => void] {
  const {
    validate,
    serialize = JSON.stringify,
    deserialize = JSON.parse as (raw: string) => unknown,
  } = options

  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key)
      if (raw === null) return initialValue

      const parsed = deserialize(raw)
      if (validate && !validate(parsed)) return initialValue
      return parsed as T
    } catch {
      return initialValue
    }
  })

  const store = useCallback(
    (next: T) => {
      setValue(next)
      try {
        window.localStorage.setItem(key, serialize(next))
      } catch {
      }
    },
    [key, serialize],
  )

  return [value, store]
}
