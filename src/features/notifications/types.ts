export type { NotificationAudience } from '@/constants'

export type NotificationCategory = 'order' | 'offer' | 'payment' | 'account'

export interface AppNotification {
  id: number
  category: NotificationCategory
  title: string
  body: string
  /** A route in the app the message is about, as the server names it. */
  action_path: string | null
  order_id: number | null
  read_at: string | null
  created_at: string
}

export interface NotificationFeed {
  items: AppNotification[]
  unread_count: number
}

export interface UnreadCount {
  count: number
  /** True means "at least `count`" — render "99+". */
  capped: boolean
}

export interface MarkReadResult {
  updated: number
  unread_count: number
}

export interface NotificationPreferences {
  recipient_type: 'customer' | 'partner'
  email_enabled: boolean
  push_enabled: boolean
  muted_categories: string[]
  /** The categories this person may switch off — job offers never are. */
  mutable_categories: string[]
}

export type PreferenceUpdate = Partial<
  Pick<NotificationPreferences, 'email_enabled' | 'push_enabled' | 'muted_categories'>
>
