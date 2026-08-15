import type { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { AuthModalProvider, AuthProvider } from '@/features/auth'

/**
 * Every application-wide provider, in one place.
 *
 * Order matters:
 *
 *   BrowserRouter    outermost — providers below may navigate or read location
 *     AuthProvider   owns the session; runs the startup probe once
 *       AuthModalProvider  opens the login dialog, and may act on auth state
 *
 * New cross-cutting concerns (a toast system, a query client, a socket
 * connection) are added here and nowhere else, so nothing has to be threaded
 * through App.tsx.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthModalProvider>{children}</AuthModalProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
