import { NotificationV2ResponseType } from '@shared/definition/vrchat-api-response'
import type { VRChatAPI } from '../vrchat-api'
import type { NotificationHub } from './notification-hub'

export class NotificationOperation {
  constructor(
    private readonly hub: NotificationHub,
    private readonly api: VRChatAPI
  ) {}

  public markNotificationAsRead(notificationId: string) {
    this.hub.handleSeeNotification(notificationId)
    return this.api.ref.sessionAPI.notifications.markNotificationAsRead(notificationId)
  }

  public async respondNotificationV2(
    notificationId: string,
    type: NotificationV2ResponseType,
    data: string
  ) {
    const result = await this.api.ref.sessionAPI.notifications.respondToNotificationV2(
      notificationId,
      type,
      data
    )

    this.hub.handleRemoveNotification(notificationId)
    return result
  }

  public deleteNotificationV1(notificationId: string) {
    this.hub.handleRemoveNotification(notificationId)
    return this.api.ref.sessionAPI.notifications.deleteNotification(notificationId)
  }

  public deleteNotificationV2(notificationId: string) {
    this.hub.handleRemoveNotification(notificationId)
    return this.api.ref.sessionAPI.notifications.deleteNotificationV2(notificationId)
  }

  public clearNotifications() {
    this.hub.clearNotifications('all')
    return Promise.all([
      this.api.ref.sessionAPI.notifications.clearNotificationsV1(),
      this.api.ref.sessionAPI.notifications.clearNotificationsV2()
    ])
  }
}
