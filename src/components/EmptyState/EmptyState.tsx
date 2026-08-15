import type { ReactNode } from 'react'

import './EmptyState.css'

export interface EmptyStateProps {
  title: string
  description?: string
  /** A call to action, so an empty list is a starting point rather than a dead end. */
  action?: ReactNode
  icon?: ReactNode
}

/** Shown when a list has no items, or a feature is not available yet. */
export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="empty">
      {icon && (
        <div className="empty__icon" aria-hidden="true">
          {icon}
        </div>
      )}
      <h3 className="empty__title">{title}</h3>
      {description && <p className="empty__description">{description}</p>}
      {action && <div className="empty__action">{action}</div>}
    </div>
  )
}
