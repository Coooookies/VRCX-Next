import { useModule } from '@renderer/shared/hooks/use-module'
import type { VRChatNotifications } from '@renderer/shared/modules/vrchat-notifications'
import type { NotificationV2ResponseType } from '@shared/definition/vrchat-api-response-replenish'

export function useSidebarNotificationsSubmit() {
  const notifications = useModule<VRChatNotifications>('VRChatNotifications')

  function markNotificationV1AsRead(notificationId: string) {
    return notifications.markNotificationV1AsRead(notificationId)
  }

  function respondNotificationV2(
    notificationId: string,
    type: NotificationV2ResponseType,
    data: string
  ) {
    return notifications.respondNotificationV2(notificationId, type, data)
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

  function responseInvite(notificationId: string) {
    console.log(notificationId)
    return Promise.resolve()
  }

  function responseInviteWithMessage(notificationId: string) {
    console.log(notificationId)
    return Promise.resolve()
  }

  function responseInviteWithPhoto(notificationId: string) {
    console.log(notificationId)
    return Promise.resolve()
  }

  function acceptFriendRequest(notificationId: string) {
    console.log(notificationId)
    return Promise.resolve()
  }

  function declineFriendRequest(notificationId: string) {
    console.log(notificationId)
    return Promise.resolve()
  }

  return {
    markNotificationV1AsRead,
    respondNotificationV2,
    deleteNotificationV1,
    deleteNotificationV2,
    clearNotifications,
    responseInvite,
    responseInviteWithMessage,
    responseInviteWithPhoto,
    acceptFriendRequest,
    declineFriendRequest
  }
}
