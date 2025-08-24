import Nanobus from 'nanobus'
import type { Database } from '../database'
import type { NotificationInformation } from '@shared/definition/vrchat-notifications'

export class NotificationRepository extends Nanobus<{
  'notification-v1:remote:insert': (notifications: NotificationInformation[]) => void
  'notification-v1:remote:update': (notifications: NotificationInformation[]) => void
  'notification-v1:remote:delete': (notificationId: string) => void
  'notification-v1:remote:clear': () => void
}> {
  constructor(private readonly database: Database) {
    super('VRChatNotifications:Repository')
  }

  private notificationsV1 = new Map<string, NotificationInformation>()

  public getRemoteNotificationV1(notificationId: string) {
    return this.notificationsV1.get(notificationId)
  }

  public getAllRemoteNotificationsV1() {
    return [...this.notificationsV1.values()]
  }

  public hasRemoteNotificationV1(notificationId: string) {
    return this.notificationsV1.has(notificationId)
  }

  public deleteRemoteNotificationV1(notificationId: string) {
    const deleted = this.notificationsV1.delete(notificationId)
    if (deleted) {
      this.emit('notification-v1:remote:delete', notificationId)
    }
    return deleted
  }

  public saveRemoteNotificationV1(
    notification: NotificationInformation | NotificationInformation[]
  ) {
    const pendingNotifications = Array.isArray(notification) ? notification : [notification]
    const pendingUpdateNotifications: NotificationInformation[] = []
    const pendingInsertNotifications: NotificationInformation[] = []

    for (const notification of pendingNotifications) {
      if (this.hasRemoteNotificationV1(notification.notificationId)) {
        pendingUpdateNotifications.push(notification)
      } else {
        pendingInsertNotifications.push(notification)
      }

      // Update the NotificationV1 in the repository
      this.notificationsV1.set(notification.notificationId, notification)
    }

    if (pendingInsertNotifications.length > 0) {
      this.emit('notification-v1:remote:insert', pendingInsertNotifications)
    }

    if (pendingUpdateNotifications.length > 0) {
      this.emit('notification-v1:remote:update', pendingUpdateNotifications)
    }
  }

  // public saveLocalNotificationV1(
  //   notification: NotificationInformation | NotificationInformation[],
  //   receiveUserId: string
  // ) {}

  public clearRemoteNotificationsV1() {
    this.notificationsV1.clear()
    this.emit('notification-v1:remote:clear')
  }

  public clear() {
    this.clearRemoteNotificationsV1()
  }
}
