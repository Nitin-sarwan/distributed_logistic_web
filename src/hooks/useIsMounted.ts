import { useEffect, useRef, type MutableRefObject } from 'react'

export function useIsMounted(): MutableRefObject<boolean> {
  const isMounted = useRef(true)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  return isMounted
}
