import { cx } from '@/utils'

import './Loader.css'

export interface LoaderProps {
  label?: string
  size?: 'sm' | 'md' | 'lg'
  fullPage?: boolean
  className?: string
}

export function Loader({ label, size = 'md', fullPage = false, className }: LoaderProps) {
  return (
    <div
      className={cx('loader', fullPage && 'loader--full', className)}
      role="status"
      aria-live="polite"
    >
      <span className={cx('loader__spinner', `loader__spinner--${size}`)} aria-hidden="true" />
      {label ? (
        <span className="loader__label">{label}</span>
      ) : (
        <span className="sr-only">Loading</span>
      )}
    </div>
  )
}
