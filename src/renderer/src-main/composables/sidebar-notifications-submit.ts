import { useModule } from '@renderer/shared/hooks/use-module'
import { sleep } from '@shared/utils/async'
import type { VRChatNotifications } from '@renderer/shared/modules/vrchat-notifications'
import type { NotificationV2ResponseType } from '@shared/definition/vrchat-api-response-replenish'

export function useSidebarNotificationsSubmit() {
  const notifications = useModule<VRChatNotifications>('VRChatNotifications')

  function markNotificationAsRead(notificationId: string) {
    return notifications.markNotificationAsRead(notificationId)
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
    return sleep(1000)
  }

  function responseInviteWithMessage(notificationId: string) {
    console.log(notificationId)
    return sleep(1000)
  }

  function responseInviteWithPhoto(notificationId: string) {
    console.log(notificationId)
    return sleep(1000)
  }

  function acceptFriendRequest(notificationId: string) {
    console.log(notificationId)
    return sleep(1000)
  }

  function declineFriendRequest(notificationId: string) {
    console.log(notificationId)
    return sleep(1000)
  }

  return {
    markNotificationAsRead,
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
