export type VehicleStatus = 'pending' | 'inactive' | 'active' | 'rejected'

export type VehicleType = 'two_wheeler' | 'three_wheeler' | 'mini_truck' | 'truck'

export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  two_wheeler: 'Two wheeler',
  three_wheeler: 'Three wheeler',
  mini_truck: 'Mini truck',
  truck: 'Truck',
}

export const VEHICLE_MAX_CAPACITY: Record<VehicleType, number> = {
  two_wheeler: 30,
  three_wheeler: 500,
  mini_truck: 1500,
  truck: 10000,
}

export interface Vehicle {
  id: number
  partner_id: number
  vehicle_type: VehicleType
  vehicle_number: string
  model_name: string | null
  capacity: number
  status: VehicleStatus
  created_at: string
  updated_at: string | null
}

export interface CreateVehiclePayload {
  vehicle_type: VehicleType
  vehicle_number: string
  capacity: number
  model_name?: string | null
}

export interface UpdateVehiclePayload {
  capacity?: number
  model_name?: string | null
}
