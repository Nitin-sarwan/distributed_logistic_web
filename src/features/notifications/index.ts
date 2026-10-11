export { NotificationBell } from './components/NotificationBell'
export type { NotificationBellProps } from './components/NotificationBell'
export { NotificationCenter } from './components/NotificationCenter'
export type { NotificationCenterProps } from './components/NotificationCenter'
export { NotificationPreferencesCard } from './components/NotificationPreferencesCard'

export { useUnreadCount } from './hooks/useUnreadCount'
export { useNotificationFeed } from './hooks/useNotificationFeed'
export { useNotificationPreferences } from './hooks/useNotificationPreferences'

export { categoryLabel, relativeTime, resolveActionPath } from './utils'

export type {
  AppNotification,
  NotificationAudience,
  NotificationCategory,
  NotificationFeed,
  NotificationPreferences,
  PreferenceUpdate,
  UnreadCount,
} from './types'
