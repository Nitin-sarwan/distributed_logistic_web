import { useCallback, useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { cx } from '@/utils'

import './Modal.css'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  /** Announced as the dialog's accessible name. */
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
  /** Set false while a request is in flight, so a stray click cannot cancel it. */
  closeOnBackdrop?: boolean
  /** Hide the × when the dialog must be resolved by an explicit choice. */
  showCloseButton?: boolean
}

/** Elements that can hold focus — used to keep Tab inside the dialog. */
const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * An accessible dialog, rendered through a portal.
 *
 * The portal matters: rendered in place, the modal would inherit the stacking
 * context and `overflow` of whatever contained it, so a parent with
 * `overflow: hidden` would clip it. Attaching to `document.body` sidesteps that
 * entirely.
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnBackdrop = true,
  showCloseButton = true,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  // Where focus was before the dialog opened, so it can be handed back on close.
  const previouslyFocused = useRef<HTMLElement | null>(null)
  const titleId = useId()

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return

      // Focus trap: without it, Tab walks out of the dialog into the page
      // behind, which for a screen-reader user means silently leaving the
      // dialog while it still covers the screen.
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    },
    [onClose],
  )

  useEffect(() => {
    if (!isOpen) return

    previouslyFocused.current = document.activeElement as HTMLElement | null

    // Stop the page behind from scrolling while the dialog is open.
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    document.addEventListener('keydown', handleKeyDown)

    // Move focus into the dialog so keyboard and screen-reader users start
    // inside it rather than at the top of the page behind.
    const timer = window.setTimeout(() => {
      const target = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE)
      ;(target ?? dialogRef.current)?.focus()
    }, 0)

    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = overflow
      previouslyFocused.current?.focus()
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return createPortal(
    <div
      className="modal__backdrop"
      onMouseDown={(event) => {
        // mousedown, not click: a click fires when press and release land on
        // different elements, so dragging a text selection out of the dialog
        // would otherwise close it.
        if (closeOnBackdrop && event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        className={cx('modal', `modal--${size}`)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
      >
        {(title || showCloseButton) && (
          <div className="modal__header">
            {title && (
              <h2 className="modal__title" id={titleId}>
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                type="button"
                className="modal__close"
                onClick={onClose}
                aria-label="Close dialog"
              >
                <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
                  <path
                    d="M5 5l10 10M15 5L5 15"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        <div className="modal__body">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
