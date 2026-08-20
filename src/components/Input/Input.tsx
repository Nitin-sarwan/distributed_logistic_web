import { forwardRef, useId, type InputHTMLAttributes } from 'react'

import { cx } from '@/utils'

import './Input.css'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  prefix?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, prefix, id, className, ...rest },
  ref,
) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const messageId = `${inputId}-message`

  return (
    <div className={cx('field', error && 'field--invalid', className)}>
      {label && (
        <label className="field__label" htmlFor={inputId}>
          {label}
        </label>
      )}

      <div className="field__control">
        {prefix && <span className="field__prefix">{prefix}</span>}
        <input
          id={inputId}
          ref={ref}
          className="field__input"

          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? messageId : undefined}
          {...rest}
        />
      </div>

      {(error || hint) && (
        <p
          id={messageId}
          className={cx('field__message', error && 'field__message--error')}

          role={error ? 'alert' : undefined}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  )
})
