import type { AvailabilityBlock } from './types'

export const STALE_AFTER_MINUTES = 5

export const HEARTBEAT_INTERVAL_MS = 60_000

export const AVAILABILITY_BLOCK_COPY: Record<
  AvailabilityBlock,
  { title: string; body: string }
> = {
  suspended: {
    title: 'Your account is suspended',
    body: 'You cannot take deliveries right now. Contact support to find out why and what happens next.',
  },
  'on-trip': {
    title: 'You are on a delivery',
    body: 'Finish or hand back the current delivery before changing your availability.',
  },
  'not-verified': {
    title: 'Verification pending',
    body: 'Your documents are with our team. You can set up your vehicle now — you will be able to go online as soon as you are verified.',
  },
  'no-active-vehicle': {
    title: 'No vehicle in use',
    body: 'Add a vehicle and set it as the one you are driving. We need to know what you can carry before we send you work.',
  },
}
