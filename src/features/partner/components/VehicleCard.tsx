import { Button } from '@/components/Button'

import { VEHICLE_TYPE_LABELS, type Vehicle } from '../types'
import { VehicleStatusPill } from './StatusPill'

export interface VehicleCardProps {
  vehicle: Vehicle
  isBusy: boolean
  onEdit: (vehicle: Vehicle) => void
  onActivate: (id: number) => void
  onRemove: (id: number) => void
  isOnTrip: boolean
}

export function VehicleCard({
  vehicle,
  isBusy,
  onEdit,
  onActivate,
  onRemove,
  isOnTrip,
}: VehicleCardProps) {
  const isActive = vehicle.status === 'active'
  const isVerified = vehicle.status === 'active' || vehicle.status === 'inactive'

  return (
    <article className={isActive ? 'vehicle vehicle--active' : 'vehicle'}>
      <header className="vehicle__header">
        <div>
          <h3 className="vehicle__number">{vehicle.vehicle_number}</h3>
          <p className="vehicle__type">
            {VEHICLE_TYPE_LABELS[vehicle.vehicle_type]}
            {vehicle.model_name && <span> · {vehicle.model_name}</span>}
          </p>
        </div>
        <VehicleStatusPill status={vehicle.status} />
      </header>

      <dl className="vehicle__facts">
        <div>
          <dt>Type</dt>
          <dd>{VEHICLE_TYPE_LABELS[vehicle.vehicle_type]}</dd>
        </div>
        <div>
          <dt>Vehicle number</dt>
          <dd>{vehicle.vehicle_number}</dd>
        </div>
        <div>
          <dt>Capacity</dt>
          <dd>{vehicle.capacity} kg</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>
            {vehicle.status === 'active' && 'In use'}
            {vehicle.status === 'inactive' && 'Verified'}
            {vehicle.status === 'pending' && 'Awaiting verification'}
            {vehicle.status === 'rejected' && 'Rejected'}
          </dd>
        </div>
      </dl>

      {vehicle.status === 'pending' && (
        <p className="vehicle__note">
          Our team is checking this vehicle&apos;s documents. You can use it once it is
          verified.
        </p>
      )}

      {vehicle.status === 'rejected' && (
        <p className="vehicle__note vehicle__note--danger">
          This vehicle was not approved and cannot be used. Contact support if you think
          that is wrong.
        </p>
      )}

      <div className="vehicle__actions">
        {isVerified && !isActive && (
          <Button
            size="sm"
            onClick={() => onActivate(vehicle.id)}
            isLoading={isBusy}
            loadingText="Switching…"
          >
            Use this vehicle
          </Button>
        )}

        <Button variant="secondary" size="sm" onClick={() => onEdit(vehicle)}>
          Edit vehicle
        </Button>

        <Button
          variant="danger"
          size="sm"
          onClick={() => onRemove(vehicle.id)}
          disabled={isBusy || (isActive && isOnTrip)}
          title={
            isActive && isOnTrip
              ? 'You are on a delivery with this vehicle.'
              : undefined
          }
        >
          Remove
        </Button>
      </div>

      {isActive && !isOnTrip && (
        <p className="vehicle__note">
          Removing the vehicle you are driving will take you offline.
        </p>
      )}
    </article>
  )
}
