import type { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { MapStyleProvider } from '@/components/Map'
import { AuthModalProvider, AuthProvider } from '@/features/auth'
import { PartnerAuthProvider } from '@/features/partner'

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PartnerAuthProvider>
          <AuthModalProvider>
            <MapStyleProvider>{children}</MapStyleProvider>
          </AuthModalProvider>
        </PartnerAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
