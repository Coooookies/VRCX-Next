import { toNotificationV1BaseInformation, toNotificationV2BaseInformation } from './factory'
import { PipelineEvents } from '@shared/definition/vrchat-pipeline'
import type { VRChatUsers } from '../vrchat-users'
import type { VRChatPipeline } from '../vrchat-pipeline'
import type { LoggerFactory } from '@main/logger'
import type { NotificationRepository } from './repository'
import type { NotificationFetcher } from './fetcher'
import type { NotificationInformation } from '@shared/definition/vrchat-notifications'
import type { Notification, NotificationV2 } from '@shared/definition/vrchat-api-response'
import type {
  PipelineEventMessage,
  PipelineEventNotificationV2Delete,
  PipelineEventNotificationV2Update,
  PipelineEventResponseNotification
} from '@shared/definition/vrchat-pipeline'

export class NotificationEventBinding {
  constructor(
    private readonly logger: LoggerFactory,
    private readonly repository: NotificationRepository,
    private readonly fetcher: NotificationFetcher,
    private readonly users: VRChatUsers,
    private readonly pipeline: VRChatPipeline
  ) {
    this.bindEvents()
  }

  private bindEvents() {
    this.pipeline.on('message', (message: PipelineEventMessage) => {
      this.handlePipeMessage(message)
    })

    this.repository.on('notification:remote:insert', (notifications) => {
      notifications.forEach((notification) => {
        this.logger.info(
          `New notification received: [${notification.notificationId}] ${notification.type} from ${
            notification.senderName || 'Unknown Sender'
          }`
        )
      })
    })

    this.repository.on('notification:remote:update', (notifications) => {
      notifications.forEach((notification) => {
        this.logger.info(
          `Notification updated: [${notification.notificationId}] ${notification.type} from ${
            notification.senderName || 'Unknown Sender'
          }`
        )
      })
    })

    this.repository.on('notification:remote:delete', (notificationIds) => {
      notificationIds.forEach((notificationId) => {
        this.logger.info(`Notification deleted: [${notificationId}]`)
      })
    })

    this.repository.on('notification:remote:clear', (version) => {
      this.logger.info(`Notifications cleared for version: ${version}`)
    })
  }

  private async handlePipeMessage(message: PipelineEventMessage): Promise<void> {
    switch (message.type) {
      case PipelineEvents.Notification: {
        await this.handleNotification(message.content)
        break
      }

      case PipelineEvents.NotificationV2: {
        await this.handleNotificationV2(message.content)
        break
      }

      case PipelineEvents.NotificationV2Delete: {
        await this.handleDeleteNotificationsV2(message.content)
        break
      }

      case PipelineEvents.NotificationV2Update: {
        await this.handleUpdateNotificationsV2(message.content)
        break
      }

      case PipelineEvents.ResponseNotification: {
        await this.handleResponseNotification(message.content)
        break
      }

      case PipelineEvents.SeeNotification: {
        await this.handleSeeNotification(message.content)
        break
      }

      case PipelineEvents.HideNotification: {
        await this.handleHideNotification(message.content)
        break
      }

      case PipelineEvents.ClearNotification: {
        await this.handleClearNotification()
        break
      }
    }
  }

  private async handleNotification(notification: Notification): Promise<void> {
    const beforeNotification = toNotificationV1BaseInformation(notification)
    const processedNotification = await this.fetcher.enrichNotificationV1(beforeNotification)
    this.upsertNotification(processedNotification)
  }

  private async handleNotificationV2(notification: NotificationV2): Promise<void> {
    const beforeNotification = toNotificationV2BaseInformation(notification)
    const processedNotification = await this.fetcher.enrichNotificationV1(beforeNotification)
    this.upsertNotification(processedNotification)
  }

  private async handleSeeNotification(notificationId: string): Promise<void> {
    this.changeNotificationAsSeen(notificationId, true)
  }

  private async handleHideNotification(notificationId: string): Promise<void> {
    this.changeNotificationAsResponded(notificationId)
  }

  private async handleResponseNotification({
    notificationId,
    responseId
  }: PipelineEventResponseNotification): Promise<void> {
    const responseNotification = await this.fetcher.fetchNotification(responseId)
    if (responseNotification) {
      this.upsertNotification(responseNotification)
    }

    this.changeNotificationAsResponded(notificationId)
  }

  private async handleClearNotification(): Promise<void> {
    this.repository.clearNotifications('v1')
  }

  private async handleDeleteNotificationsV2({
    ids
  }: PipelineEventNotificationV2Delete): Promise<void> {
    this.repository.deleteNotification(ids)
  }

  private async handleUpdateNotificationsV2({
    id,
    updates
  }: PipelineEventNotificationV2Update): Promise<void> {
    const notification = this.repository.getNotification(id)
    if (notification) {
      const raw = notification.raw as NotificationV2
      this.upsertNotification({
        ...notification,
        ...toNotificationV2BaseInformation({
          ...raw,
          ...updates
        })
      })
    }
  }

  private async changeNotificationAsSeen(notificationId: string, seen: boolean): Promise<void> {
    const notification = this.repository.getNotification(notificationId)
    if (notification) {
      this.upsertNotification({
        ...notification,
        isRead: seen
      })
    }
  }

  private async changeNotificationAsResponded(notificationId: string): Promise<void> {
    this.repository.deleteNotification(notificationId)
  }

  private upsertNotification(notification: NotificationInformation): void {
    if (this.users.state.user) {
      this.repository.saveNotification(notification, this.users.state.user.userId)
    }
  }
}
