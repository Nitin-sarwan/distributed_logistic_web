import type { ReactNode } from 'react'

import { cx } from '@/utils'

import './Alert.css'

export type AlertTone = 'error' | 'success' | 'info' | 'warning'

export interface AlertProps {
  tone?: AlertTone
  children: ReactNode
  className?: string
}

export function Alert({ tone = 'error', children, className }: AlertProps) {
  return (
    <div
      className={cx('alert', `alert--${tone}`, className)}
      role={tone === 'error' ? 'alert' : 'status'}
      aria-live={tone === 'error' ? 'assertive' : 'polite'}
    >
      {children}
    </div>
  )
}
