import { Link } from 'react-router-dom'

import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { EmptyState } from '@/components/EmptyState'
import { ROUTES } from '@/constants'

import './ComingSoon.css'

export interface ComingSoonProps {
  title: string
  subtitle: string
  service: string
  description: string
}

export function ComingSoon({ title, subtitle, service, description }: ComingSoonProps) {
  return (
    <div className="page container">
      <h1 className="page__title">{title}</h1>
      <p className="page__subtitle">{subtitle}</p>

      <div className="coming-soon">
        <Card>
          <EmptyState
            icon={<ClockIcon />}
            title={`${service} isn't connected yet`}
            description={description}
            action={
              <Link to={ROUTES.home}>
                <Button variant="secondary">Back to home</Button>
              </Link>
            }
          />
        </Card>
      </div>
    </div>
  )
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 7.5V12l3 1.75"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
