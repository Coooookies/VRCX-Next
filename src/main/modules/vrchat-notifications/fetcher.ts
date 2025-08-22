import type { Notification, NotificationV2 } from '@shared/definition/vrchat-api-response'
import type { VRChatAPI } from '../vrchat-api'
import type { NotificationRepository } from './repository'
import type { LoggerFactory } from '@main/logger'
import { NOTIFICATIONS_QUERY_SIZE } from './constants'

export class NotificationFetcher {
  constructor(
    private readonly logger: LoggerFactory,
    private readonly repository: NotificationRepository,
    private readonly api: VRChatAPI
  ) {}

  public async initNotifications() {
    this.logger.info('notification-v1', JSON.stringify(await this.loadV1Notifications(), null, 2))
    this.logger.info('notification-v2', JSON.stringify(await this.loadV2Notifications(), null, 2))
    console.log(this.repository)
  }

  private async loadV1Notifications(): Promise<Notification[]> {
    const notifications: Notification[] = []
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

      notifications.push(...notificationsBatch)
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
