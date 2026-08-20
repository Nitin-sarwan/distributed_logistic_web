import { cx } from '@/utils'

import type { PartnerStatus, VehicleStatus } from '../types'

type Tone = 'online' | 'busy' | 'idle' | 'blocked' | 'pending'

const PARTNER_STATUS: Record<PartnerStatus, { label: string; tone: Tone }> = {
  online: { label: 'Online', tone: 'online' },
  on_trip: { label: 'On a delivery', tone: 'busy' },
  offline: { label: 'Offline', tone: 'idle' },
  suspended: { label: 'Suspended', tone: 'blocked' },
}

const VEHICLE_STATUS: Record<VehicleStatus, { label: string; tone: Tone }> = {
  active: { label: 'In use', tone: 'online' },
  inactive: { label: 'Verified', tone: 'idle' },
  pending: { label: 'Awaiting verification', tone: 'pending' },
  rejected: { label: 'Rejected', tone: 'blocked' },
}

export function PartnerStatusPill({ status }: { status: PartnerStatus }) {
  const { label, tone } = PARTNER_STATUS[status]
  return <Pill label={label} tone={tone} />
}

export function VehicleStatusPill({ status }: { status: VehicleStatus }) {
  const { label, tone } = VEHICLE_STATUS[status]
  return <Pill label={label} tone={tone} />
}

function Pill({ label, tone }: { label: string; tone: Tone }) {
  return (
    <span className={cx('pill', `pill--${tone}`)}>

      <span className="pill__dot" aria-hidden="true" />
      {label}
    </span>
  )
}
