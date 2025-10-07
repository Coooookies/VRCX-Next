import Nanobus from 'nanobus'
import { NotificationSenderType } from '@shared/definition/vrchat-notifications'
import { toNotificationDependency, toNotificationV2BaseInformation } from './factory'
import type { NotificationV2 } from '@shared/definition/vrchat-api-response'
import type { UserEntity } from '../database/entities/vrchat-cache-users'
import type { GroupEntity } from '../database/entities/vrchat-cache-group'
import type { VRChatGroups } from '../vrchat-groups'
import type { VRChatUsers } from '../vrchat-users'
import type {
  NotificationBaseInformation,
  NotificationInformation,
  NotificationVersion
} from '@shared/definition/vrchat-notifications'

export class NotificationHub extends Nanobus<{
  'sync:present-notification': (notifications: NotificationInformation[]) => void
  'sync:append-notification': (notification: NotificationInformation) => void
  'sync:update-notification': (
    notificationId: string,
    notifications: NotificationInformation
  ) => void
  'sync:remove-notification': (notificationId: string) => void
  'sync:clear-notification': (version: NotificationVersion) => void
  'event:notification-add': (notification: NotificationInformation) => void
  'event:notification-update': (
    notificationId: string,
    notification: NotificationInformation
  ) => void
  'event:notification-remove': (notificationId: string) => void
  'event:notification-clear': (version: NotificationVersion) => void
}> {
  private currentNotifications = new Map<string, NotificationInformation>()

  constructor(
    private readonly groups: VRChatGroups,
    private readonly users: VRChatUsers
  ) {
    super('VRChatFriends:NotificationHub')
  }

  public async syncInitialNotifications(notifications: NotificationBaseInformation[]) {
    const { userIds, groupIds } = toNotificationDependency(notifications)

    const fullNotifications: NotificationInformation[] = []
    const users = await this.users.fetchUserSummaries(userIds)
    const groups = await this.groups.fetchGroupSummaries(groupIds)

    for (const notification of notifications) {
      const fullNotification = this.assembleNotificationReference(notification, users, groups)
      fullNotifications.push(fullNotification)
      this.currentNotifications.set(notification.notificationId, fullNotification)
    }

    if (fullNotifications.length > 0) {
      this.emit('sync:present-notification', fullNotifications)
    }
  }

  public clearNotifications(version: NotificationVersion) {
    switch (version) {
      case 'v1':
      case 'v2': {
        for (const [id, notification] of this.currentNotifications) {
          if (notification.version === version) {
            this.currentNotifications.delete(id)
          }
        }
        break
      }
      case 'all': {
        this.currentNotifications.clear()
        break
      }
    }

    this.emit('sync:clear-notification', version)
    this.emit('event:notification-clear', version)
  }

  public async handleAppendNotification(notification: NotificationBaseInformation) {
    const { userIds, groupIds } = toNotificationDependency(notification)

    const users = await this.users.fetchUserSummaries(userIds)
    const groups = await this.groups.fetchGroupSummaries(groupIds)
    const fullNotification = this.assembleNotificationReference(notification, users, groups)

    this.currentNotifications.set(notification.notificationId, fullNotification)
    this.emit('sync:append-notification', fullNotification)
    this.emit('event:notification-add', fullNotification)
  }

  public handleUpdateNotificationV2(notificationId: string, update: Partial<NotificationV2>) {
    const existingNotification = this.currentNotifications.get(notificationId)
    if (!existingNotification) {
      return
    }

    const rawNotification = existingNotification.raw as NotificationV2
    const updatedNotification: NotificationInformation = {
      ...existingNotification,
      ...toNotificationV2BaseInformation({
        ...rawNotification,
        ...update
      })
    }

    this.currentNotifications.set(notificationId, updatedNotification)
    this.emit('sync:update-notification', notificationId, updatedNotification)
    this.emit('event:notification-update', notificationId, updatedNotification)
  }

  public handleRemoveNotification(notificationId: string) {
    if (this.currentNotifications.has(notificationId)) {
      this.currentNotifications.delete(notificationId)
      this.emit('sync:remove-notification', notificationId)
      this.emit('event:notification-remove', notificationId)
    }
  }

  public handleSeeNotification(notificationId: string) {
    const existingNotification = this.currentNotifications.get(notificationId)
    if (!existingNotification) {
      return
    }

    if (existingNotification.isRead) {
      return
    }

    const updatedNotification: NotificationInformation = {
      ...existingNotification,
      isRead: true
    }

    this.currentNotifications.set(notificationId, updatedNotification)
    this.emit('sync:update-notification', notificationId, updatedNotification)
    this.emit('event:notification-update', notificationId, updatedNotification)
  }

  private assembleNotificationReference(
    notification: NotificationBaseInformation,
    users: Map<string, UserEntity>,
    groups: Map<string, GroupEntity>
  ): NotificationInformation {
    const updatedNotification: NotificationInformation = {
      ...notification,
      senderName: undefined,
      senderAvatarFileId: undefined,
      senderAvatarFileVersion: undefined
    }

    const senderId = notification.senderId
    const senderType = notification.senderType

    if (senderType === NotificationSenderType.User && senderId) {
      const user = users.get(senderId)
      if (user) {
        updatedNotification.senderName = user.displayName
        updatedNotification.senderAvatarFileId = user.profileIconFileId
        updatedNotification.senderAvatarFileVersion = user.profileIconFileVersion
      }
    } else if (senderType === NotificationSenderType.Group && senderId) {
      const group = groups.get(senderId)
      if (group) {
        updatedNotification.senderName = group.groupName
        updatedNotification.senderAvatarFileId = group.iconFileId
        updatedNotification.senderAvatarFileVersion = group.iconFileVersion
      }
    }

    return updatedNotification
  }

  public get notifications(): NotificationInformation[] {
    return [...this.currentNotifications.values()]
  }
}
