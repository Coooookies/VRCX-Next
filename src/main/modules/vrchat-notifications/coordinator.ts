import { toNotificationV1BaseInformation, toNotificationV2BaseInformation } from './factory'
import { PipelineEvents } from '@shared/definition/vrchat-pipeline'
import type { VRChatPipeline } from '../vrchat-pipeline'
import type { LoggerFactory } from '@main/logger'
import type { NotificationFetcher } from './fetcher'
import type { NotificationHub } from './notification-hub'
import type { Notification, NotificationV2 } from '@shared/definition/vrchat-api-response'
import type {
  PipelineEventMessage,
  PipelineEventNotificationV2Delete,
  PipelineEventNotificationV2Update,
  PipelineEventResponseNotification
} from '@shared/definition/vrchat-pipeline'
import { NotificationHistory } from './notification-history'

export class NotificationCoordinator {
  constructor(
    private readonly logger: LoggerFactory,
    private readonly fetcher: NotificationFetcher,
    private readonly hub: NotificationHub,
    private readonly history: NotificationHistory,
    private readonly pipeline: VRChatPipeline
  ) {
    this.bindEvents()
  }

  public async initialize() {
    const result = await this.fetcher.fetchNotifications()
    this.logger.info(`Fetched ${result.length} notifications in total.`)
    await this.hub.syncInitialNotifications(result)
  }

  public uninitialize() {
    this.hub.clearNotifications('all')
  }

  private bindEvents() {
    this.pipeline.on('message', (message: PipelineEventMessage) => {
      this.handlePipeMessage(message)
    })

    this.hub.on('sync:present-notification', (notifications) => {
      this.history.saveNotification(notifications)
    })

    this.hub.on('sync:update-notification', (_, notification) => {
      this.history.saveNotification(notification)
    })

    this.hub.on('sync:append-notification', (notification) => {
      this.history.saveNotification(notification)
    })

    this.hub.on('event:notification-add', (notification) => {
      this.logger.info(
        `New notification: [${notification.notificationId}] from ${notification.senderName || 'Unknown'} (${notification.senderId || notification.senderType})`
      )
    })

    this.hub.on('event:notification-remove', (notificationId) => {
      this.logger.info(`Notification removed: [${notificationId}]`)
    })

    this.hub.on('event:notification-clear', (version) => {
      this.logger.info(`Notifications cleared: ${version}`)
    })

    this.hub.on('event:notification-update', (notificationId, notification) => {
      this.logger.info(
        `Notification updated: [${notificationId}] from ${notification.senderName || 'Unknown'} (${notification.senderId || notification.senderType})`
      )
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

  private async handleNotification(notification: Notification) {
    await this.hub.handleAppendNotification(toNotificationV1BaseInformation(notification))
  }

  private async handleNotificationV2(notification: NotificationV2) {
    await this.hub.handleAppendNotification(toNotificationV2BaseInformation(notification))
  }

  private handleSeeNotification(notificationId: string) {
    this.hub.handleSeeNotification(notificationId)
  }

  private handleHideNotification(notificationId: string) {
    this.hub.handleRemoveNotification(notificationId)
  }

  private async handleResponseNotification({
    notificationId,
    responseId
  }: PipelineEventResponseNotification): Promise<void> {
    // Remove the original notification
    this.hub.handleRemoveNotification(notificationId)

    // Fetch and add the response notification
    const responseNotification = await this.fetcher.fetchNotification(responseId)
    if (responseNotification) {
      await this.hub.handleAppendNotification(responseNotification)
    }
  }

  private async handleClearNotification(): Promise<void> {
    this.hub.clearNotifications('all')
  }

  private async handleDeleteNotificationsV2({
    ids
  }: PipelineEventNotificationV2Delete): Promise<void> {
    ids.forEach((id) => this.hub.handleRemoveNotification(id))
  }

  private async handleUpdateNotificationsV2({
    id,
    updates
  }: PipelineEventNotificationV2Update): Promise<void> {
    this.hub.handleUpdateNotificationV2(id, updates)
  }
}
