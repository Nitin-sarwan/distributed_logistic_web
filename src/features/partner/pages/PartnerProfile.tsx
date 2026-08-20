import { PartnerAccountStatus } from '../components/PartnerAccountStatus'
import { PartnerDetailsForm } from '../components/PartnerDetailsForm'
import { PartnerSessionsCard } from '../components/PartnerSessionsCard'
import { usePartner } from '../hooks/usePartner'

import '../components/PartnerUI.css'

export function PartnerProfile() {
  const { partner } = usePartner()

  if (!partner) return null

  return (
    <div className="partner-page partner-stack">
      <div>
        <h1 className="partner-page__title">Profile</h1>
        <p className="partner-page__subtitle">Your partner account details.</p>
      </div>

      <PartnerAccountStatus partner={partner} />
      <PartnerDetailsForm partner={partner} />
      <PartnerSessionsCard />
    </div>
  )
}
