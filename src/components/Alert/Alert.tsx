import type { ReactNode } from 'react'

import { cx } from '@/utils'

import './Alert.css'

export type AlertTone = 'error' | 'success' | 'info' | 'warning'

export interface AlertProps {
  tone?: AlertTone
  children: ReactNode
  className?: string
}

/**
 * A message banner for form-level and page-level feedback.
 *
 * Errors use `role="alert"`, which interrupts a screen reader immediately — a
 * failed login must not go unnoticed. Non-errors use a polite live region so
 * they are announced without cutting off whatever is being read.
 */
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
