import type { NotificationV2 } from '@shared/definition/vrchat-api-response'
import type { VRChatAPI } from '../vrchat-api'
import type { NotificationRepository } from './repository'
import type { LoggerFactory } from '@main/logger'
import { NOTIFICATIONS_QUERY_SIZE } from './constants'
import { NotificationInformation } from '@shared/definition/vrchat-notifications'
import { toNotificationInformation } from './factory'

export class NotificationFetcher {
  constructor(
    private readonly logger: LoggerFactory,
    private readonly repository: NotificationRepository,
    private readonly api: VRChatAPI
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

      notifications.push(...notificationsBatch.map((n) => toNotificationInformation(n)))
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
}
