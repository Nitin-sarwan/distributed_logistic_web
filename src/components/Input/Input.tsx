import { forwardRef, useId, type InputHTMLAttributes } from 'react'

import { cx } from '@/utils'

import './Input.css'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  /** Validation message. Its presence switches the field to the error style. */
  error?: string
  /** Guidance shown below the field while there is no error. */
  hint?: string
  /** Rendered inside the field, before the text — a currency or location mark. */
  prefix?: string
}

/**
 * A labelled text field.
 *
 * `forwardRef` is required: react-hook-form's `register()` returns a ref and
 * hands it to the DOM node it must read and focus.
 */
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
          // Announces the invalid state and points screen readers at the message
          // below, so the error is not visual-only.
          aria-invalid={error ? true : undefined}
          aria-describedby={error || hint ? messageId : undefined}
          {...rest}
        />
      </div>

      {(error || hint) && (
        <p
          id={messageId}
          className={cx('field__message', error && 'field__message--error')}
          // Errors appear after submission, so they must be announced.
          role={error ? 'alert' : undefined}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  )
})
