import { NOTIFICATIONS_QUERY_SIZE } from './constants'
import type { VRChatAPI } from '../vrchat-api'
import type { NotificationRepository } from './repository'
import { NotificationSenderType } from '@shared/definition/vrchat-notifications'
import type { LoggerFactory } from '@main/logger'
import type { VRChatUsers } from '../vrchat-users'
import type { VRChatGroups } from '../vrchat-groups'
import type { UserEntity } from '../database/entities/users'
import type { GroupEntity } from '../database/entities/group'
import type {
  NotificationBaseInformation,
  NotificationInformation
} from '@shared/definition/vrchat-notifications'
import {
  toNotificationDependency,
  toNotificationV1BaseInformation,
  toNotificationV2BaseInformation
} from './factory'

export class NotificationFetcher {
  constructor(
    private readonly logger: LoggerFactory,
    private readonly repository: NotificationRepository,
    private readonly api: VRChatAPI,
    private readonly users: VRChatUsers,
    private readonly groups: VRChatGroups
  ) {}

  public async initNotifications() {
    this.repository.clear()

    const notificationsV1 = await this.loadV1Notifications()
    const notificationsV2 = await this.loadV2Notifications()
    const notifications = [...notificationsV1, ...notificationsV2]
    if (this.users.state.user) {
      this.repository.saveNotification(notifications, this.users.state.user.userId)
    }

    this.logger.info(
      `Notifications Fetched! ${notifications.length} in total`,
      `notification-v1: ${notificationsV1.length}, notification-v2: ${notificationsV2.length}`
    )
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

      const informations = notificationsBatch.map((n) => toNotificationV1BaseInformation(n))
      const { userIds, groupIds } = toNotificationDependency(informations)

      const users = await this.users.Fetcher.fetchUserSummary(userIds)
      const groups = await this.groups.Fetcher.fetchGroupSummary(groupIds)
      const processedNotifications = this.processNotification(informations, users, groups)

      notifications.push(...processedNotifications)
      startOffset += notificationsBatch.length

      this.logger.info(`Fetched ${notifications.length} Notifications...`)
      if (notificationsBatch.length < NOTIFICATIONS_QUERY_SIZE) {
        break
      }
    }

    return notifications
  }

  private async loadV2Notifications(): Promise<NotificationInformation[]> {
    const notifications: NotificationInformation[] = []
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

      const informations = notificationsBatch.map((n) => toNotificationV2BaseInformation(n))
      const { userIds, groupIds } = toNotificationDependency(informations)

      const users = await this.users.Fetcher.fetchUserSummary(userIds)
      const groups = await this.groups.Fetcher.fetchGroupSummary(groupIds)
      const processedNotifications = this.processNotification(informations, users, groups)

      notifications.push(...processedNotifications)
      startOffset += notificationsBatch.length

      this.logger.info(`Fetched ${notifications.length} Notifications...`)
      if (notificationsBatch.length < NOTIFICATIONS_QUERY_SIZE) {
        break
      }
    }

    return notifications
  }

  public async fetchNotification(notificationId: string): Promise<NotificationInformation | null> {
    const result = await this.api.ref.sessionAPI.notifications.getNotification(notificationId)
    if (!result.success) {
      this.logger.error(`Failed to fetch Notification: ${notificationId}`)
      return null
    }

    const notification = result.value.body
    const baseInformation = toNotificationV1BaseInformation(notification)
    return this.enrichNotificationV1(baseInformation)
  }

  public processNotification(
    notifications: NotificationBaseInformation[],
    users: Map<string, UserEntity>,
    groups: Map<string, GroupEntity>
  ): NotificationInformation[] {
    const results: NotificationInformation[] = []

    for (const notification of notifications) {
      const senderId = notification.senderId
      const senderType = notification.senderType

      let senderName: string | null = null
      let senderAvatarFileId: string | null = null
      let senderAvatarFileVersion: number | null = null

      if (senderType === NotificationSenderType.User && senderId) {
        const user = users.get(senderId)
        if (user) {
          senderName = user.displayName
          senderAvatarFileId = user.profileIconFileId
          senderAvatarFileVersion = user.profileIconFileVersion
        }
      } else if (senderType === NotificationSenderType.Group && senderId) {
        const group = groups.get(senderId)
        if (group) {
          senderName = group.groupName
          senderAvatarFileId = group.iconFileId
          senderAvatarFileVersion = group.iconFileVersion
        }
      }

      results.push({
        ...notification,
        senderName,
        senderAvatarFileId,
        senderAvatarFileVersion
      })
    }

    return results
  }

  public async enrichNotificationV1(
    notification: NotificationBaseInformation
  ): Promise<NotificationInformation> {
    const { userIds, groupIds } = toNotificationDependency([notification])
    const users = await this.users.Fetcher.fetchUserSummary(userIds)
    const groups = await this.groups.Fetcher.fetchGroupSummary(groupIds)
    return this.processNotification([notification], users, groups)[0]
  }
}
