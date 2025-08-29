import Nanobus from 'nanobus'
import { toNotificationEntity } from './factory'
import { NotificationEntity } from '../database/entities/notifications'
import type { Repository } from 'typeorm'
import type { Database } from '../database'
import type {
  NotificationInformation,
  NotificationVersion
} from '@shared/definition/vrchat-notifications'

export class NotificationRepository extends Nanobus<{
  'notification:remote:insert': (notifications: NotificationInformation[]) => void
  'notification:remote:update': (notifications: NotificationInformation[]) => void
  'notification:remote:delete': (notificationIds: string[]) => void
  'notification:remote:clear': (version: NotificationVersion) => void
}> {
  constructor(private readonly database: Database) {
    super('VRChatNotifications:Repository')
  }

  private notifications = new Map<string, NotificationInformation>()

  public get repository(): Repository<NotificationEntity> {
    return this.database.source.getRepository(NotificationEntity)
  }

  private upsertNotifications(entities: NotificationEntity | NotificationEntity[]) {
    const entitiesArr = Array.isArray(entities) ? entities : [entities]
    return this.repository.upsert(entitiesArr, {
      conflictPaths: ['notificationId', 'ownerUserId'],
      skipUpdateIfNoValuesChanged: true
    })
  }

  public async saveNotification(
    notification: NotificationInformation | NotificationInformation[],
    ownerUserId: string
  ) {
    const pendingNotifications = Array.isArray(notification) ? notification : [notification]
    const pendingUpdateNotifications: NotificationInformation[] = []
    const pendingInsertNotifications: NotificationInformation[] = []

    for (const notification of pendingNotifications) {
      if (this.hasNotification(notification.notificationId)) {
        pendingUpdateNotifications.push(notification)
      } else {
        pendingInsertNotifications.push(notification)
      }

      this.notifications.set(notification.notificationId, notification)
    }

    const entities = pendingNotifications.map((n) => toNotificationEntity(n, ownerUserId))
    await this.upsertNotifications(entities)

    if (pendingInsertNotifications.length > 0) {
      this.emit('notification:remote:insert', pendingInsertNotifications)
    }

    if (pendingUpdateNotifications.length > 0) {
      this.emit('notification:remote:update', pendingUpdateNotifications)
    }
  }

  public getNotification(notificationId: string) {
    return this.notifications.get(notificationId)
  }

  public getAllNotifications() {
    return [...this.notifications.values()]
  }

  public hasNotification(notificationId: string) {
    return this.notifications.has(notificationId)
  }

  public deleteNotification(notificationId: string | string[]) {
    const ids = Array.isArray(notificationId) ? notificationId : [notificationId]
    for (const id of ids) {
      this.notifications.delete(id)
    }
    this.emit('notification:remote:delete', ids)
  }

  public clearNotifications(version: NotificationVersion = 'all') {
    switch (version) {
      case 'v1': {
        this.notifications.forEach((notification, notificationId) => {
          if (notification.version === 'v1') {
            this.notifications.delete(notificationId)
          }
        })
        break
      }
      case 'v2': {
        this.notifications.forEach((notification, notificationId) => {
          if (notification.version === 'v2') {
            this.notifications.delete(notificationId)
          }
        })
        break
      }
      default: {
        this.notifications.clear()
      }
    }

    this.emit('notification:remote:clear', version)
  }

  public clear() {
    this.clearNotifications()
  }
}
