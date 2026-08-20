import type { ReactNode } from 'react'

import { AuthModal } from '@/features/auth'

import { AppFooter } from '../components/AppFooter'
import { SiteHeader } from '../components/SiteHeader'

export function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app">
      <SiteHeader />

      <main className="app__main">{children}</main>

      <AuthModal />

      <AppFooter />
    </div>
  )
}
