import { toNotificationV1BaseInformation, toNotificationV2BaseInformation } from './factory'
import { NOTIFICATIONS_QUERY_SIZE } from './constants'
import type { VRChatAPI } from '../vrchat-api'
import type { LoggerFactory } from '@main/logger'
import type { NotificationBaseInformation } from '@shared/definition/vrchat-notifications'

export class NotificationFetcher {
  constructor(
    private readonly logger: LoggerFactory,
    private readonly api: VRChatAPI
  ) {}

  public async fetchNotifications() {
    const notificationsV1 = await this.fetchV1Notifications()
    const notificationsV2 = await this.fetchV2Notifications()
    return [...notificationsV1, ...notificationsV2]
  }

  private async fetchV1Notifications(): Promise<NotificationBaseInformation[]> {
    const notifications: NotificationBaseInformation[] = []
    let startOffset = 0

    while (true) {
      const result = await this.api.ref.sessionAPI.notifications.getNotifications(
        startOffset,
        NOTIFICATIONS_QUERY_SIZE
      )

      if (!result.success) {
        this.logger.error(`Failed to fetch V1 Notifications, error: ${result.error.message}`)
        break
      }

      const notificationsBatch = result.value.body
      if (notificationsBatch.length === 0) {
        break
      }

      const currentNotifications = notificationsBatch.map((n) => toNotificationV1BaseInformation(n))
      notifications.push(...currentNotifications)
      startOffset += notificationsBatch.length

      this.logger.info(`Fetched ${notifications.length} V1 Notifications...`)
      if (notificationsBatch.length < NOTIFICATIONS_QUERY_SIZE) {
        break
      }
    }

    return notifications
  }

  private async fetchV2Notifications(): Promise<NotificationBaseInformation[]> {
    const notifications: NotificationBaseInformation[] = []
    let startOffset = 0

    while (true) {
      const result = await this.api.ref.sessionAPI.notifications.getNotificationsV2(
        startOffset,
        NOTIFICATIONS_QUERY_SIZE
      )

      if (!result.success) {
        this.logger.warn(`Failed to fetch V2 Notifications, error: ${result.error.message}`)
        break
      }

      const notificationsBatch = result.value.body
      if (notificationsBatch.length === 0) {
        break
      }

      const currentNotifications = notificationsBatch.map((n) => toNotificationV2BaseInformation(n))
      notifications.push(...currentNotifications)
      startOffset += notificationsBatch.length

      this.logger.info(`Fetched ${notifications.length} V2 Notifications...`)
      if (notificationsBatch.length < NOTIFICATIONS_QUERY_SIZE) {
        break
      }
    }

    return notifications
  }

  public async fetchNotification(
    notificationId: string
  ): Promise<NotificationBaseInformation | null> {
    const result = await this.api.ref.sessionAPI.notifications.getNotification(notificationId)
    if (!result.success) {
      this.logger.error(
        `Failed to fetch V1 Notification: ${notificationId}, error: ${result.error.message}`
      )
      return null
    }

    const notification = result.value.body
    return toNotificationV1BaseInformation(notification)
  }
}
