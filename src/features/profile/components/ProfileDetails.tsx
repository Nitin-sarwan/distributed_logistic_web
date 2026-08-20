import { Card } from '@/components/Card'
import { formatDate, formatPhone } from '@/utils'
import type { User } from '@/types'

import './ProfileDetails.css'

export interface ProfileDetailsProps {
  user: User
}

export function ProfileDetails({ user }: ProfileDetailsProps) {
  return (
    <Card title="Account details" description="The details on your LogisticPartner account.">
      <dl className="profile-details">
        <div className="profile-details__row">
          <dt>Name</dt>
          <dd>{user.name}</dd>
        </div>

        <div className="profile-details__row">
          <dt>Email</dt>
          <dd>{user.email}</dd>
        </div>

        <div className="profile-details__row">
          <dt>Phone</dt>
          <dd>{formatPhone(user.phone)}</dd>
        </div>

        <div className="profile-details__row">
          <dt>Member since</dt>
          <dd>{formatDate(user.created_at)}</dd>
        </div>
      </dl>
    </Card>
  )
}
