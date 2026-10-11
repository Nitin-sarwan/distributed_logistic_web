import { NotificationCenter, NotificationPreferencesCard } from '@/features/notifications'

import { usePartner } from '../hooks/usePartner'

import '../components/PartnerUI.css'

export function PartnerNotifications() {
  const { partner } = usePartner()

  if (!partner) return null

  return (
    <div className="partner-page partner-stack">
      <div>
        <h1 className="partner-page__title">Notifications</h1>
        <p className="partner-page__subtitle">
          Job offers, assignments, and anything about your account.
        </p>
      </div>

      <NotificationCenter
        audience="partner"
        emptyDescription="Offers and delivery updates will appear here once you start taking jobs."
      />
      <NotificationPreferencesCard audience="partner" />
    </div>
  )
}
