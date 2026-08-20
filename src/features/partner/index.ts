export { PartnerAuthProvider } from './context/PartnerAuthProvider'
export { PartnerAuthContext } from './context/PartnerAuthContext'
export type { PartnerAuthContextValue } from './context/PartnerAuthContext'
export { partnerAuthReducer, initialPartnerAuthState } from './context/partnerAuthReducer'
export type { PartnerAuthAction } from './context/partnerAuthReducer'

export { usePartner } from './hooks/usePartner'
export { useVehicles } from './hooks/useVehicles'
export { useVehicleList } from './hooks/useVehicleList'
export { useAvailability } from './hooks/useAvailability'
export { useDevicePosition } from './hooks/useDevicePosition'
export { useLocationHeartbeat } from './hooks/useLocationHeartbeat'
export { usePartnerLocation } from './hooks/usePartnerLocation'

export { RequirePartner } from './components/RequirePartner'
export { PartnerLayout } from './components/PartnerLayout'
export { PartnerHeader } from './components/PartnerHeader'
export { PartnerSidebar } from './components/PartnerSidebar'
export { AvailabilityToggle } from './components/AvailabilityToggle'
export { AvailabilityBlockAlert } from './components/AvailabilityBlockAlert'
export { StaleLocationAlert } from './components/StaleLocationAlert'
export { LocationCard } from './components/LocationCard'
export { PartnerAccountStatus } from './components/PartnerAccountStatus'
export { PartnerDetailsForm } from './components/PartnerDetailsForm'
export { PartnerSessionsCard } from './components/PartnerSessionsCard'
export { PartnerSignupForm } from './components/PartnerSignupForm'
export { VehicleCard } from './components/VehicleCard'
export { VehicleForm } from './components/VehicleForm'
export { VehicleCreateForm } from './components/VehicleCreateForm'
export { VehicleEditForm } from './components/VehicleEditForm'
export { VehicleTypeSelect } from './components/VehicleTypeSelect'
export { VehicleSections } from './components/VehicleSections'
export { DeliveryCard } from './components/DeliveryCard'
export type { Delivery, DeliveryStatus } from './components/DeliveryCard'
export { PartnerStatusPill, VehicleStatusPill } from './components/StatusPill'

export { PartnerLogin } from './pages/PartnerLogin'
export { PartnerSignup } from './pages/PartnerSignup'
export { PartnerDashboard } from './pages/PartnerDashboard'
export { PartnerVehicle } from './pages/PartnerVehicle'
export { PartnerProfile } from './pages/PartnerProfile'
export { PartnerDeliveries } from './pages/PartnerDeliveries'

export type {
  Partner,
  PartnerStatus,
  PartnerAuthState,
  Vehicle,
  VehicleStatus,
  VehicleType,
  AvailabilityBlock,
} from './types'
export { VEHICLE_TYPE_LABELS, VEHICLE_MAX_CAPACITY } from './types'

export {
  AVAILABILITY_BLOCK_COPY,
  HEARTBEAT_INTERVAL_MS,
  STALE_AFTER_MINUTES,
} from './constants'
export {
  availabilityBlock,
  describeFreshness,
  isLocationStale,
  minutesSince,
} from './utils'
