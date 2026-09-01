import { API_ROUTES } from '@/constants'
import type { Order } from '@/features/orders'
import { get, post } from '@/services'

export function getDeliveries(completed = false): Promise<Order[]> {
  return get<Order[]>(API_ROUTES.deliveries.list, { params: { completed } })
}

export function markPickedUp(id: number): Promise<Order> {
  return post<Order>(API_ROUTES.deliveries.pickedUp(id))
}

export function markDelivered(id: number): Promise<Order> {
  return post<Order>(API_ROUTES.deliveries.delivered(id))
}
