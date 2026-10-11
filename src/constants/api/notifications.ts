// Two prefixes for one API, because the gateway maps one cookie per prefix: the
// customer feed is authenticated with the customer cookie, the driver's with the
// partner cookie. Same endpoints underneath.
export const NOTIFICATION_BASES = {
  customer: '/api/notifications',
  partner: '/api/deliveries/notifications',
} as const

export type NotificationAudience = keyof typeof NOTIFICATION_BASES

export function notificationRoutes(audience: NotificationAudience) {
  const base = NOTIFICATION_BASES[audience]
  return {
    feed: base,
    unreadCount: `${base}/unread-count`,
    read: (id: number | string) => `${base}/${id}/read`,
    readAll: `${base}/read-all`,
    preferences: `${base}/preferences`,
  } as const
}
