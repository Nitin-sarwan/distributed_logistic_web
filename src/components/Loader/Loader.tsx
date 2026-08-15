import { cx } from '@/utils'

import './Loader.css'

export interface LoaderProps {
  /** Shown beside the spinner and announced, e.g. "Loading addresses…". */
  label?: string
  size?: 'sm' | 'md' | 'lg'
  /** Centres the loader in a tall block, for whole-page or whole-panel waits. */
  fullPage?: boolean
  className?: string
}

/**
 * The single loading indicator.
 *
 * `role="status"` announces the label when it appears, so a screen-reader user
 * is told the app is working rather than facing silence.
 */
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
