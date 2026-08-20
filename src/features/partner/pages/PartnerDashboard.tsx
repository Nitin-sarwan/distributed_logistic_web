import { Link } from 'react-router-dom'

import { Alert } from '@/components/Alert'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { EmptyState } from '@/components/EmptyState'
import { ROUTES } from '@/constants'

import { AvailabilityToggle } from '../components/AvailabilityToggle'
import { LocationCard } from '../components/LocationCard'
import { usePartner } from '../hooks/usePartner'
import { useVehicles } from '../hooks/useVehicles'
import { VEHICLE_TYPE_LABELS } from '../types'

import '../components/PartnerUI.css'

function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name
}

export function PartnerDashboard() {
  const { partner } = usePartner()
  const { activeVehicle, isLoading: isVehiclesLoading } = useVehicles()

  if (!partner) return null

  return (
    <div className="partner-page partner-stack">
      <div>
        <h1 className="partner-page__title">
          {greeting()}, {firstName(partner.name)}
        </h1>
        <p className="partner-page__subtitle">
          {partner.is_verified
            ? 'Here is where things stand today.'
            : 'Finish setting up while we verify your documents.'}
        </p>
      </div>

      {!partner.is_verified && (
        <Alert tone="info">
          <strong>We are verifying your account.</strong> You will be able to go online
          and receive deliveries once our team has checked your documents. Adding your
          vehicle now means you are ready the moment that happens.
        </Alert>
      )}

      <AvailabilityToggle
        activeVehicle={activeVehicle}
        isVehiclesLoading={isVehiclesLoading}
      />

      <LocationCard />

      <div className="stat-row">
        <div className="stat">
          <p className="stat__label">Rating</p>
          <p className="stat__value">
            {partner.rating_count > 0 ? partner.rating.toFixed(1) : '—'}
          </p>
          <p className="stat__note">

            {partner.rating_count > 0
              ? `From ${partner.rating_count} ${partner.rating_count === 1 ? 'rating' : 'ratings'}`
              : 'No ratings yet'}
          </p>
        </div>

        <div className="stat">
          <p className="stat__label">Vehicle</p>
          <p className="stat__value">
            {activeVehicle ? activeVehicle.vehicle_number : '—'}
          </p>
          <p className="stat__note">
            {activeVehicle
              ? `${VEHICLE_TYPE_LABELS[activeVehicle.vehicle_type]} · ${activeVehicle.capacity} kg`
              : 'None in use'}
          </p>
        </div>

        <div className="stat">
          <p className="stat__label">Verification</p>
          <p className="stat__value">{partner.is_verified ? 'Verified' : 'Pending'}</p>
          <p className="stat__note">
            {partner.is_verified ? 'You can accept deliveries' : 'With our team'}
          </p>
        </div>
      </div>

      <Card
        title="Today's deliveries"
        description="Work assigned to you appears here."
        action={
          <Link to={ROUTES.partnerDeliveries}>
            <Button variant="secondary" size="sm">
              View all
            </Button>
          </Link>
        }
      >

        <EmptyState
          title="No deliveries yet"
          description={
            partner.status === 'online'
              ? 'You are online. New deliveries will show up here as they are assigned to you.'
              : 'Go online to start receiving deliveries.'
          }
        />
      </Card>
    </div>
  )
}
