import { Link, useParams } from 'react-router-dom'

import { Alert } from '@/components/Alert'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Loader } from '@/components/Loader'
import { ROUTES } from '@/constants'
import {
  OrderMap,
  OrderRoute,
  OrderStatusPill,
  OrderSummary,
  OrderTimeline,
  PartnerPanel,
  isCancellable,
  needsConfirmation,
  useOrder,
  useOrderTracking,
} from '@/features/orders'

export function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>()
  const id = Number(orderId)
  const { order, history, isLoading, error, isWorking, confirm, cancel } = useOrder(id)
  const tracking = useOrderTracking(id, order?.status)

  if (isLoading && !order) return <Loader fullPage label="Loading your delivery…" />

  if (!order) {
    return (
      <div className="page container">
        <Alert tone="error">{error ?? 'We could not find that order.'}</Alert>
        <Link to={ROUTES.orders}>Back to my orders</Link>
      </div>
    )
  }

  return (
    <div className="page container">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to={ROUTES.orders}>My orders</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{order.public_ref}</span>
      </nav>

      <div className="order-detail__head">
        <h1 className="page__title">{order.public_ref}</h1>
        <OrderStatusPill status={order.status} />
      </div>

      {error && <Alert tone="error">{error}</Alert>}

      {needsConfirmation(order.status) && (
        <Alert tone="info">
          This is an estimate. Confirm to book it — nothing is charged until you do.
        </Alert>
      )}

      <div className="order-detail">
        <div className="order-detail__aside">
          <Card title="Route">
            <OrderRoute pickup={order.pickup} drop={order.drop} />
          </Card>

          <Card title="Details">
            <OrderSummary order={order} />
          </Card>

          <PartnerPanel order={order} tracking={tracking} />

          <div className="order-actions">
            {isCancellable(order.status) && (
              <Button
                variant="secondary"
                onClick={() => void cancel()}
                isLoading={isWorking}
                loadingText="Working…"
              >
                Cancel delivery
              </Button>
            )}
            {needsConfirmation(order.status) && (
              <Button
                onClick={() => void confirm()}
                isLoading={isWorking}
                loadingText="Confirming…"
              >
                Confirm booking
              </Button>
            )}
          </div>
        </div>

        <div className="order-detail__aside">
          <OrderMap order={order} tracking={tracking} height={260} />
          <Card title="Progress">
            <OrderTimeline entries={history} />
          </Card>
        </div>
      </div>
    </div>
  )
}
