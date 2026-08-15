import { useState, type FormEvent } from 'react'

import { Alert } from '@/components/Alert'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { useRequireAuth } from '@/features/auth'

import './Home.css'

/**
 * The pickup → drop booking widget.
 *
 * The Order and Pricing services do not exist yet, so this collects the
 * locations and stops there. It is built as a real form rather than a mock so
 * that wiring it up later is one function call, not a rewrite.
 *
 * Note what it does *not* do: it never demands a login to type in. Someone
 * should be able to describe the delivery they want before being asked who they
 * are. Authentication is requested only at "Get estimate", and afterwards the
 * entered locations are still there — that is what `useRequireAuth` preserves.
 */
export function BookingWidget() {
  const requireAuth = useRequireAuth()

  const [pickup, setPickup] = useState('')
  const [drop, setDrop] = useState('')
  const [notice, setNotice] = useState<string | null>(null)

  const canSubmit = pickup.trim().length > 0 && drop.trim().length > 0

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setNotice(null)

    // Gated here rather than on the inputs, and resumed after login with the
    // form untouched. Convenience only — the Pricing Service will enforce its
    // own rules when it exists.
    requireAuth(() => {
      setNotice(
        'Pricing is not connected yet. Once the Pricing and Order services are live, this will return a fare estimate for your trip.',
      )
    })
  }

  return (
    <form className="booking" onSubmit={handleSubmit}>
      {/* The rail spans only the two location fields — it represents the
          journey between them, so letting it run down past the button would
          make it decoration rather than a cue. */}
      <div className="booking__locations">
        <div className="booking__route" aria-hidden="true">
          <span className="booking__dot booking__dot--pickup" />
          <span className="booking__line" />
          <span className="booking__dot booking__dot--drop" />
        </div>

        <div className="booking__fields">
          <Input
            label="Pickup location"
            placeholder="Enter pickup location"
            value={pickup}
            onChange={(event) => setPickup(event.target.value)}
            autoComplete="off"
          />

          <Input
            label="Drop location"
            placeholder="Enter drop location"
            value={drop}
            onChange={(event) => setDrop(event.target.value)}
            autoComplete="off"
          />
        </div>
      </div>

      <Button type="submit" size="lg" fullWidth disabled={!canSubmit}>
        Get estimate
      </Button>

      {notice && <Alert tone="info">{notice}</Alert>}
    </form>
  )
}
