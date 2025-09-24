import { useModule } from '@renderer/shared/hooks/use-module'
import { sleep } from '@shared/utils/async'
import type { VRChatNotifications } from '@renderer/shared/modules/vrchat-notifications'
import type { NotificationV2ResponseType } from '@shared/definition/vrchat-api-response-replenish'

export interface SidebarNotificationsEvents {
  onMarkNotificationAsRead?: (notificationId: string, promise: Promise<void>) => void
  onRespondNotificationV2?: (
    notificationId: string,
    type: NotificationV2ResponseType,
    data: string,
    promise: Promise<void>
  ) => void
  onDeleteNotificationV1?: (notificationId: string, promise: Promise<void>) => void
  onDeleteNotificationV2?: (notificationId: string, promise: Promise<void>) => void
  onClearNotifications?: (promise: Promise<void>) => void
  onAcceptInvite?: (notificationId: string, promise: Promise<void>) => void
  onResponseInvite?: (notificationId: string, promise: Promise<void>) => void
  onResponseInviteWithMessage?: (notificationId: string, promise: Promise<void>) => void
  onResponseInviteWithPhoto?: (notificationId: string, promise: Promise<void>) => void
  onAcceptFriendRequest?: (notificationId: string, promise: Promise<void>) => void
  onDeclineFriendRequest?: (notificationId: string, promise: Promise<void>) => void
}

export function useSidebarNotificationsSubmit(events: SidebarNotificationsEvents = {}) {
  const notifications = useModule<VRChatNotifications>('VRChatNotifications')

  function markNotificationAsRead(notificationId: string) {
    const promise = notifications.markNotificationAsRead(notificationId)
    events.onMarkNotificationAsRead?.(notificationId, promise)
    return promise
  }

  function respondNotificationV2(
    notificationId: string,
    type: NotificationV2ResponseType,
    data: string
  ) {
    const promise = notifications.respondNotificationV2(notificationId, type, data)
    events.onRespondNotificationV2?.(notificationId, type, data, promise)
    return promise
  }

  function deleteNotificationV1(notificationId: string) {
    const promise = notifications.deleteNotificationV1(notificationId)
    events.onDeleteNotificationV1?.(notificationId, promise)
    return promise
  }

  function deleteNotificationV2(notificationId: string) {
    const promise = notifications.deleteNotificationV2(notificationId)
    events.onDeleteNotificationV2?.(notificationId, promise)
    return promise
  }

  function clearNotifications() {
    const promise = notifications.clearNotifications()
    events.onClearNotifications?.(promise)
    return promise
  }

  function acceptInvite(notificationId: string) {
    const promise = sleep(1000)
    events.onAcceptInvite?.(notificationId, promise)
    return promise
  }

  function responseInvite(notificationId: string) {
    const promise = sleep(1000)
    events.onResponseInvite?.(notificationId, promise)
    return promise
  }

  function responseInviteWithMessage(notificationId: string) {
    const promise = sleep(1000)
    events.onResponseInviteWithMessage?.(notificationId, promise)
    return promise
  }

  function responseInviteWithPhoto(notificationId: string) {
    const promise = sleep(1000)
    events.onResponseInviteWithPhoto?.(notificationId, promise)
    return promise
  }

  function acceptFriendRequest(notificationId: string) {
    const promise = sleep(1000)
    events.onAcceptFriendRequest?.(notificationId, promise)
    return promise
  }

  function declineFriendRequest(notificationId: string) {
    const promise = sleep(1000)
    events.onDeclineFriendRequest?.(notificationId, promise)
    return promise
  }

  return {
    markNotificationAsRead,
    respondNotificationV2,
    deleteNotificationV1,
    deleteNotificationV2,
    clearNotifications,
    acceptInvite,
    responseInvite,
    responseInviteWithMessage,
    responseInviteWithPhoto,
    acceptFriendRequest,
    declineFriendRequest
  }
}
