import { NotificationCenter, NotificationPreferencesCard } from '@/features/notifications'

export function Notifications() {
  return (
    <div className="page container">
      <h1 className="page__title">Notifications</h1>
      <p className="page__subtitle">Updates about your deliveries and your account.</p>

      <div className="notifications-layout">
        <NotificationCenter
          audience="customer"
          emptyDescription="When a delivery is confirmed, picked up or delivered, you will hear about it here."
        />
        <NotificationPreferencesCard audience="customer" />
      </div>
    </div>
  )
}
