import { NotificationV2ResponseType } from '@shared/definition/vrchat-api-response'
import type { VRChatAPI } from '../vrchat-api'
import type { VRChatUsers } from '../vrchat-users'
import type { NotificationRepository } from './repository'

export class NotificationOperation {
  constructor(
    private readonly repository: NotificationRepository,
    private readonly api: VRChatAPI,
    private readonly users: VRChatUsers
  ) {}

  public markNotificationV1AsRead(notificationId: string) {
    const notification = this.repository.getNotification(notificationId)
    const currentUser = this.users.state.user

    if (notification && currentUser) {
      this.repository.saveNotification(
        {
          ...notification,
          isRead: true
        },
        currentUser.userId
      )
    }

    return this.api.ref.sessionAPI.notifications.markNotificationAsRead(notificationId)
  }

  public respondNotificationV2(
    notificationId: string,
    type: NotificationV2ResponseType,
    data: string
  ) {
    return this.api.ref.sessionAPI.notifications
      .respondToNotificationV2(notificationId, type, data)
      .then(() => this.repository.deleteNotification(notificationId))
  }

  public deleteNotificationV1(notificationId: string) {
    this.repository.deleteNotification(notificationId)
    return this.api.ref.sessionAPI.notifications.deleteNotification(notificationId)
  }

  public deleteNotificationV2(notificationId: string) {
    this.repository.deleteNotification(notificationId)
    return this.api.ref.sessionAPI.notifications.deleteNotificationV2(notificationId)
  }

  public clearNotifications() {
    this.repository.clearNotifications('all')
    return Promise.all([
      this.api.ref.sessionAPI.notifications.clearNotificationsV1(),
      this.api.ref.sessionAPI.notifications.clearNotificationsV2()
    ])
  }
}
