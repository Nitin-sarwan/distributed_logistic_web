import {
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import type { AuthModalView } from './types'

/**
 * Controls the auth modal from anywhere in the app.
 *
 * Two reasons this is a context rather than local state in the header:
 *
 * 1. The header opens it, but so does any action that turns out to need a
 *    signed-in user — the booking widget, for one. Lifting it means neither
 *    has to own the other's state.
 *
 * 2. It carries the *pending action*: what the user was trying to do when they
 *    were interrupted. After a successful login the app resumes that action
 *    instead of dropping them on the home page having forgotten their intent.
 */

export interface AuthModalContextValue {
  isOpen: boolean
  view: AuthModalView
  /**
   * Open the modal.
   *
   * @param view      which form to show
   * @param onSuccess run once authentication succeeds — the interrupted action
   */
  open: (view?: AuthModalView, onSuccess?: () => void) => void
  close: () => void
  /** Switch between login and signup without closing. */
  setView: (view: AuthModalView) => void
  /** Called by the forms on success; runs the pending action and closes. */
  handleSuccess: () => void
}

export const AuthModalContext = createContext<AuthModalContextValue | null>(null)

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState<AuthModalView>('login')

  // A ref, not state: changing it must not re-render the whole tree, and it is
  // read exactly once, at the moment authentication succeeds.
  const pendingAction = useRef<(() => void) | null>(null)

  const open = useCallback((nextView: AuthModalView = 'login', onSuccess?: () => void) => {
    setView(nextView)
    pendingAction.current = onSuccess ?? null
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    // Dropped on close: the user cancelled, so resuming their previous action
    // the next time they log in would be surprising.
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
