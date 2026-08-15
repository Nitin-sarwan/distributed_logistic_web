import { Link } from 'react-router-dom'

import { Button } from '@/components/Button'
import { EmptyState } from '@/components/EmptyState'
import { ROUTES } from '@/constants'

export function NotFound() {
  return (
    <div className="page container">
      <EmptyState
        title="Page not found"
        description="The page you're looking for doesn't exist or has moved."
        action={
          <Link to={ROUTES.home}>
            <Button>Back to home</Button>
          </Link>
        }
      />
    </div>
  )
}
