import { API_ROUTES } from '@/constants'
import { get, post } from '@/services'

import type { CreateOrderPayload, Order, OrderStatusEntry } from '../types'

export function getOrders(limit = 20, offset = 0): Promise<Order[]> {
  return get<Order[]>(API_ROUTES.orders.list, { params: { limit, offset } })
}

export function getOrder(id: number): Promise<Order> {
  return get<Order>(API_ROUTES.orders.one(id))
}

export function getOrderHistory(id: number): Promise<OrderStatusEntry[]> {
  return get<OrderStatusEntry[]>(API_ROUTES.orders.history(id))
}

export function createOrder(
  payload: CreateOrderPayload,
  idempotencyKey: string,
): Promise<Order> {
  return post<Order>(API_ROUTES.orders.list, payload, {
    headers: { 'Idempotency-Key': idempotencyKey },
  })
}

export function confirmOrder(id: number): Promise<Order> {
  return post<Order>(API_ROUTES.orders.confirm(id))
}

export function cancelOrder(id: number, reason?: string): Promise<Order> {
  return post<Order>(API_ROUTES.orders.cancel(id), { reason: reason ?? null })
}
