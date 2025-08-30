import { useModule } from '@renderer/shared/hooks/use-module'
import type { VRChatNotifications } from '@renderer/shared/modules/vrchat-notifications'
import type { NotificationV2ResponseType } from '@shared/definition/vrchat-api-response-replenish'

export function useSidebarNotificationsSubmit() {
  const notifications = useModule<VRChatNotifications>('VRChatNotifications')

  function markNotificationV1AsRead(notificationId: string) {
    return notifications.markNotificationV1AsRead(notificationId)
  }

  function respondNotificationV2(notificationId: string, type: NotificationV2ResponseType) {
    return notifications.respondNotificationV2(notificationId, type)
  }

  function deleteNotificationV1(notificationId: string) {
    return notifications.deleteNotificationV1(notificationId)
  }

  function deleteNotificationV2(notificationId: string) {
    return notifications.deleteNotificationV2(notificationId)
  }

  function clearNotifications() {
    return notifications.clearNotifications()
  }

  return {
    markNotificationV1AsRead,
    respondNotificationV2,
    deleteNotificationV1,
    deleteNotificationV2,
    clearNotifications
  }
}
