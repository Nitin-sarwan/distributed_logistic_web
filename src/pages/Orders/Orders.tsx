import { Alert } from '@/components/Alert'
import { Button } from '@/components/Button'
import { EmptyState } from '@/components/EmptyState'
import { Loader } from '@/components/Loader'
import { ROUTES } from '@/constants'
import { PinIcon } from '@/features/geo'
import { OrderCard, useOrders } from '@/features/orders'
import { Link } from 'react-router-dom'

export function Orders() {
  const { orders, isLoading, error, unavailable } = useOrders()

  return (
    <div className="page container">
      <h1 className="page__title">My orders</h1>
      <p className="page__subtitle">Every delivery you have booked, in one place.</p>

      {isLoading && <Loader label="Loading your orders…" fullPage />}

      {!isLoading && unavailable && (
        <Alert tone="info">
          Orders aren&apos;t reachable. Check that the Order Service is running and
          that the gateway routes <code>/api/orders</code>.
        </Alert>
      )}

      {!isLoading && !unavailable && error && <Alert tone="error">{error}</Alert>}

      {!isLoading && !unavailable && !error && orders.length === 0 && (
        <EmptyState
          icon={<PinIcon />}
          title="No deliveries yet"
          description="Book one from the home page and it will show up here."
          action={
            <Link to={ROUTES.home}>
              <Button>Book a delivery</Button>
            </Link>
          }
        />
      )}

      {orders.length > 0 && (
        <ul className="order-list">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </ul>
      )}
    </div>
  )
}
