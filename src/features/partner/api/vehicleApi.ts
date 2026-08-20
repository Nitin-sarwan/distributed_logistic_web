import { API_ROUTES } from '@/constants'
import { del, get, patch, post } from '@/services'

import type { CreateVehiclePayload, UpdateVehiclePayload, Vehicle } from '../types'

export function getVehicles(): Promise<Vehicle[]> {
  return get<Vehicle[]>(API_ROUTES.partner.vehicles)
}

export function createVehicle(payload: CreateVehiclePayload): Promise<Vehicle> {
  return post<Vehicle>(API_ROUTES.partner.vehicles, payload)
}

export function updateVehicle(
  id: number,
  payload: UpdateVehiclePayload,
): Promise<Vehicle> {
  return patch<Vehicle>(API_ROUTES.partner.vehicle(id), payload)
}

export function activateVehicle(id: number): Promise<Vehicle> {
  return post<Vehicle>(API_ROUTES.partner.activateVehicle(id))
}

export function deleteVehicle(id: number): Promise<void> {
  return del<void>(API_ROUTES.partner.vehicle(id))
}
