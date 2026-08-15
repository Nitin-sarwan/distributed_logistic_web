import { ComingSoon } from '@/pages/ComingSoon'

/**
 * Public route: tracking is done with an order id, so someone who was sent a
 * delivery reference can use it without an account. That is why "Track order"
 * stays in the header when signed out.
 */
export function TrackOrder() {
  return (
    <ComingSoon
      title="Track your order"
      subtitle="Follow a delivery from pickup to drop."
      service="Order tracking"
      description="Live tracking arrives with the Order and Location services. You'll be able to enter a tracking id here and watch your delivery move in real time."
    />
  )
}
