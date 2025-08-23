import type { Notification } from '@shared/definition/vrchat-api-response'
import type { NotificationInformation } from '@shared/definition/vrchat-notifications'

export function toNotificationInformation(notification: Notification): NotificationInformation {
  return {
    notificationId: notification.id,
    type: notification.type,
    seen: notification.seen || false,
    message: notification.message,
    fromUserId: notification.senderUserId,
    createdAt: new Date(notification.created_at),
    detail: JSON.parse(notification.details || '{}')
  } as NotificationInformation
}
