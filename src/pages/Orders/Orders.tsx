import { ComingSoon } from '@/pages/ComingSoon'

/** Protected route. Order history belongs to a specific account. */
export function Orders() {
  return (
    <ComingSoon
      title="My orders"
      subtitle="Every delivery you've booked, in one place."
      service="Order history"
      description="Your past and active deliveries will appear here once the Order Service is live."
    />
  )
}
