import { useCallback, useEffect, useState, type RefObject } from 'react'

import type { FullscreenMode } from '../types'

export interface UseFullscreenResult {
  mode: FullscreenMode
  isExpanded: boolean
  toggle: () => void
}

export function useFullscreen(
  targetRef: RefObject<HTMLElement | null>,
): UseFullscreenResult {
  const [mode, setMode] = useState<FullscreenMode>('none')
  const isExpanded = mode !== 'none'

  const toggle = useCallback(() => {
    const target = targetRef.current
    if (!target) return

    if (document.fullscreenElement === target) {
      void document.exitFullscreen().catch(() => setMode('none'))
      return
    }

    if (mode === 'inline') {
      setMode('none')
      return
    }

    if (typeof target.requestFullscreen !== 'function') {
      setMode('inline')
      return
    }

    target.requestFullscreen().then(
      () => setMode('native'),
      () => setMode('inline'),
    )
  }, [mode, targetRef])

  useEffect(() => {
    const handleChange = () => {
      if (document.fullscreenElement === targetRef.current) return
      setMode((current) => (current === 'native' ? 'none' : current))
    }

    document.addEventListener('fullscreenchange', handleChange)
    return () => document.removeEventListener('fullscreenchange', handleChange)
  }, [targetRef])

  useEffect(() => {
    if (!isExpanded) return

    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return

      event.stopPropagation()

      if (document.fullscreenElement === targetRef.current) {
        void document.exitFullscreen().catch(() => undefined)
      }

      setMode('none')
    }

    document.addEventListener('keydown', handleKey, true)
    return () => document.removeEventListener('keydown', handleKey, true)
  }, [isExpanded, targetRef])

  return { mode, isExpanded, toggle }
}
