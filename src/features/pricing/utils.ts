import type { FareOption } from './types'

export function formatMoney(amount: string | number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(amount))
}

export function cheapestAvailable(options: FareOption[]): FareOption | null {
  return options
    .filter((option) => option.available)
    .reduce<FareOption | null>(
      (best, option) =>
        best === null || Number(option.amount) < Number(best.amount) ? option : best,
      null,
    )
}

export const VEHICLE_LABELS: Record<string, string> = {
  two_wheeler: 'Two wheeler',
  three_wheeler: 'Three wheeler',
  mini_truck: 'Mini truck',
  truck: 'Truck',
}

export function vehicleLabel(type: string): string {
  return VEHICLE_LABELS[type] ?? type
}
