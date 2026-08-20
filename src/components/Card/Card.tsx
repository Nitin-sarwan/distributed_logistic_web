import type { ReactNode } from 'react'

import { cx } from '@/utils'

import './Card.css'

export interface CardProps {
  title?: string
  description?: string
  action?: ReactNode
  children?: ReactNode
  className?: string
}

export function Card({ title, description, action, children, className }: CardProps) {
  return (
    <section className={cx('card', className)}>
      {(title || action) && (
        <header className="card__header">
          <div>
            {title && <h2 className="card__title">{title}</h2>}
            {description && <p className="card__description">{description}</p>}
          </div>
          {action && <div className="card__action">{action}</div>}
        </header>
      )}
      {children}
    </section>
  )
}
