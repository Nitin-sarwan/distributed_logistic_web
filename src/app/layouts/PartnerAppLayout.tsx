import type { ReactNode } from 'react'

export function PartnerAppLayout({ children }: { children: ReactNode }) {
  return <div className="app app--partner">{children}</div>
}
