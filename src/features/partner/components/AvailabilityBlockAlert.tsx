import { Link } from 'react-router-dom'

import { Alert } from '@/components/Alert'
import { ROUTES } from '@/constants'

import { AVAILABILITY_BLOCK_COPY } from '../constants'
import type { AvailabilityBlock } from '../types'

export function AvailabilityBlockAlert({ block }: { block: AvailabilityBlock }) {
  const copy = AVAILABILITY_BLOCK_COPY[block]

  return (
    <Alert tone={block === 'suspended' ? 'error' : 'warning'}>
      <strong>{copy.title}.</strong> {copy.body}
      {block === 'no-active-vehicle' && (
        <>
          {' '}
          <Link to={ROUTES.partnerVehicle}>Go to vehicles</Link>.
        </>
      )}
    </Alert>
  )
}
