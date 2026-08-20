import { Card } from '@/components/Card'
import { formatDate } from '@/utils'

import type { Partner } from '../types'
import { PartnerStatusPill } from './StatusPill'

export function PartnerAccountStatus({ partner }: { partner: Partner }) {
  return (
    <Card title="Account status">
      <dl className="vehicle__facts">
        <div>
          <dt>Availability</dt>
          <dd>
            <PartnerStatusPill status={partner.status} />
          </dd>
        </div>
        <div>
          <dt>Verification</dt>
          <dd>{partner.is_verified ? 'Verified' : 'Pending review'}</dd>
        </div>
        <div>
          <dt>Rating</dt>
          <dd>
            {partner.rating_count > 0
              ? `${partner.rating.toFixed(1)} (${partner.rating_count})`
              : 'No ratings yet'}
          </dd>
        </div>
        <div>
          <dt>Partner since</dt>
          <dd>{formatDate(partner.created_at)}</dd>
        </div>
      </dl>
    </Card>
  )
}
