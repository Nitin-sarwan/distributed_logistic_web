import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { Alert } from '@/components/Alert'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { EmptyState } from '@/components/EmptyState'
import { Input } from '@/components/Input'
import { Loader } from '@/components/Loader'
import { orderPath } from '@/constants'
import { useAuth, useAuthModal } from '@/features/auth'
import { OrderCard, findByRef, isLive, useOrders } from '@/features/orders'

import './TrackOrder.css'

export function TrackOrder() {
  const { user, isLoading } = useAuth()
  const { open } = useAuthModal()

  return (
    <div className="page container">
      <h1 className="page__title">Track your order</h1>
      <p className="page__subtitle">
        Follow a delivery from pickup to drop, with your driver live on the map.
      </p>

      {isLoading ? (
        <Loader label="Checking your session…" />
      ) : user ? (
        <Tracker />
      ) : (
        // Tracking shows where a person is, so it is tied to the account that
        // booked the delivery rather than to a reference anyone could type.
        <Card>
          <EmptyState
            title="Log in to track a delivery"
            description="Tracking is available for deliveries booked on your account."
            action={<Button onClick={() => open('login')}>Log in</Button>}
          />
        </Card>
      )}
    </div>
  )
}

function Tracker() {
  const navigate = useNavigate()
  const { orders, isLoading, error } = useOrders()
  const [reference, setReference] = useState('')
  const [notFound, setNotFound] = useState(false)

  const moving = orders.filter((order) => isLive(order.status))

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const match = findByRef(orders, reference)
    setNotFound(match === null)
    if (match) navigate(orderPath(match.id))
  }

  return (
    <div className="track">
      <Card title="Find a delivery" description="Enter the reference from your booking, like LP-7ZQNR5.">
        <form className="track__form" onSubmit={handleSubmit}>
          <Input
            label="Order reference"
            placeholder="LP-XXXXXX"
            value={reference}
            onChange={(event) => {
              setReference(event.target.value)
              setNotFound(false)
            }}
            error={notFound ? 'No delivery with that reference on your account.' : undefined}
          />
          <Button type="submit" disabled={reference.trim().length < 4 || isLoading}>
            Track
          </Button>
        </form>
      </Card>

      <h2 className="track__heading">On the move</h2>
      {isLoading && <Loader label="Loading your deliveries…" />}
      {error && <Alert tone="error">{error}</Alert>}
      {!isLoading && !error && moving.length === 0 && (
        <EmptyState
          title="Nothing on the move"
          description="Deliveries that are booked and not yet delivered appear here."
        />
      )}
      {moving.length > 0 && (
        <ul className="order-list">
          {moving.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </ul>
      )}
    </div>
  )
}
