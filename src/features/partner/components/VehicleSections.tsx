import { Button } from '@/components/Button'
import { Card } from '@/components/Card'

import type { Vehicle } from '../types'
import { VehicleCard } from './VehicleCard'

export interface VehicleSectionsProps {
  vehicles: Vehicle[]
  activeVehicle: Vehicle | null
  busyId: number | null
  isOnTrip: boolean
  onAdd: () => void
  onEdit: (vehicle: Vehicle) => void
  onActivate: (id: number) => void
  onRemove: (id: number) => void
}

export function VehicleSections({
  vehicles,
  activeVehicle,
  busyId,
  isOnTrip,
  onAdd,
  onEdit,
  onActivate,
  onRemove,
}: VehicleSectionsProps) {
  const others = vehicles.filter((vehicle) => vehicle.id !== activeVehicle?.id)

  const cardFor = (vehicle: Vehicle) => (
    <VehicleCard
      key={vehicle.id}
      vehicle={vehicle}
      isBusy={busyId === vehicle.id}
      isOnTrip={isOnTrip}
      onEdit={onEdit}
      onActivate={onActivate}
      onRemove={onRemove}
    />
  )

  return (
    <>
      <Card
        title={activeVehicle ? 'In use' : 'No vehicle in use'}
        description={
          activeVehicle
            ? 'This is what dispatch matches your deliveries against.'
            : 'Pick one of your verified vehicles to start receiving work.'
        }
        action={
          <Button variant="secondary" size="sm" onClick={onAdd}>
            Add vehicle
          </Button>
        }
      >
        {activeVehicle ? (
          cardFor(activeVehicle)
        ) : (
          <p className="vehicle__note">
            You will not receive deliveries until one of your vehicles is verified
            and set as in use.
          </p>
        )}
      </Card>

      {others.length > 0 && (
        <Card
          title="Your other vehicles"
          description="Switch to one of these when you change what you are driving."
        >
          <div className="partner-stack">{others.map(cardFor)}</div>
        </Card>
      )}
    </>
  )
}
