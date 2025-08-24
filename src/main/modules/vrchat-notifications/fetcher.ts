import type { Notification, NotificationV2 } from '@shared/definition/vrchat-api-response'
import type { VRChatAPI } from '../vrchat-api'
import type { NotificationRepository } from './repository'
import type { NotificationInformation } from '@shared/definition/vrchat-notifications'
import type { LocationInstanceGroup } from '@shared/definition/vrchat-instances'
import type { LoggerFactory } from '@main/logger'
import type { VRChatUsers } from '../vrchat-users'
import type { VRChatWorlds } from '../vrchat-worlds'
import type { VRChatGroups } from '../vrchat-groups'
import type { UserEntity } from '../database/entities/users'
import type { WorldEntity } from '../database/entities/world'
import type { GroupEntity } from '../database/entities/group'
import { parseLocation } from '../vrchat-worlds/location-parser'
import { isGroupInstance } from '../vrchat-worlds/factory'
import { toBaseNotificationInformation, toNotificationDependency } from './factory'
import { NotificationType } from '@shared/definition/vrchat-api-response'
import { NOTIFICATIONS_QUERY_SIZE } from './constants'

export class NotificationFetcher {
  constructor(
    private readonly logger: LoggerFactory,
    private readonly repository: NotificationRepository,
    private readonly api: VRChatAPI,
    private readonly users: VRChatUsers,
    private readonly worlds: VRChatWorlds,
    private readonly groups: VRChatGroups
  ) {}

  public async initNotifications() {
    const notificationsV1 = await this.loadV1Notifications()
    const notificationsV2 = await this.loadV2Notifications()
    this.logger.info('notification-v1', JSON.stringify(notificationsV1, null, 2))
    this.logger.info('notification-v2', JSON.stringify(notificationsV2, null, 2))
    this.repository.saveRemoteNotificationV1(notificationsV1)
  }

  private async loadV1Notifications(): Promise<NotificationInformation[]> {
    const notifications: NotificationInformation[] = []
    let startOffset = 0

    while (true) {
      const result = await this.api.ref.sessionAPI.notifications.getNotifications(
        startOffset,
        NOTIFICATIONS_QUERY_SIZE
      )

      if (!result.success) {
        this.logger.warn('Failed to fetch Notifications')
        break
      }

      const notificationsBatch = result.value.body
      if (notificationsBatch.length === 0) {
        break
      }

      const { userIds, worldIds, groupIds } = toNotificationDependency(notificationsBatch)
      const users = await this.users.Fetcher.fetchUserEntities(userIds)
      const worlds = await this.worlds.Fetcher.fetchWorldEntities(worldIds)
      const groups = await this.groups.Fetcher.fetchGroupEntities(groupIds)
      const processedNotifications = this.processNotificationV1(
        notificationsBatch,
        users,
        worlds,
        groups
      )

      notifications.push(...processedNotifications)
      startOffset += notificationsBatch.length

      this.logger.info(`Fetched ${notifications.length} Notifications...`)
      if (notificationsBatch.length < NOTIFICATIONS_QUERY_SIZE) {
        break
      }
    }

    return notifications
  }

  private async loadV2Notifications(): Promise<NotificationV2[]> {
    const notifications: NotificationV2[] = []
    let startOffset = 0

    while (true) {
      const result = await this.api.ref.sessionAPI.notifications.getNotificationsV2(
        startOffset,
        NOTIFICATIONS_QUERY_SIZE
      )

      if (!result.success) {
        this.logger.warn('Failed to fetch Notifications')
        break
      }

      const notificationsBatch = result.value.body
      if (notificationsBatch.length === 0) {
        break
      }

      notifications.push(...notificationsBatch)
      startOffset += notificationsBatch.length

      this.logger.info(`Fetched ${notifications.length} Notifications...`)
      if (notificationsBatch.length < NOTIFICATIONS_QUERY_SIZE) {
        break
      }
    }

    return notifications
  }

  public processNotificationV1(
    notifications: Notification[],
    users: Map<string, UserEntity>,
    worlds: Map<string, WorldEntity>,
    groups: Map<string, GroupEntity>
  ): NotificationInformation[] {
    const baseNotifications = notifications.map((n) => toBaseNotificationInformation(n))
    const results: NotificationInformation[] = []

    for (const notification of baseNotifications) {
      const sender = notification.senderUserId ? users.get(notification.senderUserId) || null : null
      const result = {
        notificationId: notification.notificationId,
        seen: notification.seen,
        message: notification.message,
        sender,
        createdAt: notification.createdAt
      }

      switch (notification.type) {
        case NotificationType.Invite: {
          const location = parseLocation(notification.detail.worldId)

          if (location) {
            const world = worlds.get(location.worldId)
            if (world) {
              location.worldName = notification.detail.worldName
              location.worldImageFileId = world.imageFileId
              location.worldImageFileVersion = world.imageFileVersion
            }

            if (isGroupInstance(location)) {
              const groupLocation = location as LocationInstanceGroup
              const group = groups.get(groupLocation.groupId)
              if (group) {
                groupLocation.groupName = group.groupName
                groupLocation.groupImageFileId = group.iconFileId
                groupLocation.groupImageFileVersion = group.iconFileVersion
              }
            }
          }

          results.push({
            ...result,
            type: NotificationType.Invite,
            detail: {
              inviteMessage: notification.detail.inviteMessage,
              location
            }
          })
          break
        }
        case NotificationType.Votetokick: {
          const initiator = users.get(notification.detail.initiatorUserId) || null
          const target = users.get(notification.detail.userToKickId) || null
          results.push({
            ...result,
            type: NotificationType.Votetokick,
            detail: {
              initiator,
              target
            }
          })
          break
        }
        case NotificationType.FriendRequest: {
          results.push({
            ...result,
            type: notification.type,
            detail: notification.detail
          })
          break
        }
        case NotificationType.RequestInvite: {
          results.push({
            ...result,
            type: notification.type,
            detail: notification.detail
          })
          break
        }
        case NotificationType.RequestInviteResponse: {
          results.push({
            ...result,
            type: notification.type,
            detail: notification.detail
          })
          break
        }
        case NotificationType.InviteResponse: {
          results.push({
            ...result,
            type: notification.type,
            detail: notification.detail
          })
          break
        }
        case NotificationType.Message: {
          results.push({
            ...result,
            type: notification.type,
            detail: notification.detail
          })
          break
        }
      }
    }

    return results
  }

  public async enrichNotificationV1(notification: Notification): Promise<NotificationInformation> {
    const { userIds, worldIds, groupIds } = toNotificationDependency([notification])
    const users = await this.users.Fetcher.fetchUserEntities(userIds)
    const worlds = await this.worlds.Fetcher.fetchWorldEntities(worldIds)
    const groups = await this.groups.Fetcher.fetchGroupEntities(groupIds)
    return this.processNotificationV1([notification], users, worlds, groups)[0]
  }
}
