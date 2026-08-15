import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cx } from '@/utils'

import './Button.css'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  /**
   * Shows a spinner and disables the button.
   *
   * Disabling while in flight is what prevents a double submission — a second
   * click on a login button would open a second session.
   */
  isLoading?: boolean
  /** Replaces the label while loading, e.g. "Logging in…". */
  loadingText?: string
  fullWidth?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  fullWidth = false,
  disabled,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        'btn',
        `btn--${variant}`,
        `btn--${size}`,
        fullWidth && 'btn--block',
        isLoading && 'btn--loading',
        className,
      )}
      disabled={disabled || isLoading}
      // Tells assistive technology the control is busy rather than simply
      // unresponsive.
      aria-busy={isLoading || undefined}
      {...rest}
    >
      {isLoading && <span className="btn__spinner" aria-hidden="true" />}
      <span>{isLoading && loadingText ? loadingText : children}</span>
    </button>
  )
}
