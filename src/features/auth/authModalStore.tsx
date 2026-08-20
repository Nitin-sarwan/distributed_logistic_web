import {
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import type { AuthModalView } from './types'

export interface AuthModalContextValue {
  isOpen: boolean
  view: AuthModalView
  open: (view?: AuthModalView, onSuccess?: () => void) => void
  close: () => void
  setView: (view: AuthModalView) => void
  handleSuccess: () => void
}

export const AuthModalContext = createContext<AuthModalContextValue | null>(null)

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<AuthModalView>('login')

  const pendingAction = useRef<(() => void) | null>(null)

  const open = useCallback((nextView: AuthModalView = 'login', onSuccess?: () => void) => {
    setView(nextView)
    pendingAction.current = onSuccess ?? null
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)

    pendingAction.current = null
  }, [])

  const handleSuccess = useCallback(() => {
    setIsOpen(false)
    const action = pendingAction.current
    pendingAction.current = null
    action?.()
  }, [])

  const value = useMemo<AuthModalContextValue>(
    () => ({ isOpen, view, open, close, setView, handleSuccess }),
    [isOpen, view, open, close, handleSuccess],
  )

  return <AuthModalContext.Provider value={value}>{children}</AuthModalContext.Provider>
}
