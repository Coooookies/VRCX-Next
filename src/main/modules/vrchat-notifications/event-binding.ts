import Nanobus from 'nanobus'
import { PipelineEvents } from '@shared/definition/vrchat-pipeline'
import type { VRChatPipeline } from '../vrchat-pipeline'
import type { LoggerFactory } from '@main/logger'
import type { NotificationRepository } from './repository'
import type { NotificationFetcher } from './fetcher'
import type { NotificationInformation } from '@shared/definition/vrchat-notifications'
import type { Notification } from '@shared/definition/vrchat-api-response'
import type {
  PipelineEventMessage,
  PipelineEventResponseNotification
} from '@shared/definition/vrchat-pipeline'
import { toNotificationV1BaseInformation } from './factory'
import { VRChatUsers } from '../vrchat-users'

export class NotificationEventBinding extends Nanobus<{
  'notification-v1:new': (notification: NotificationInformation) => void
  'notification-v1:see': (notificationId: string) => void
  'notification-v1:hide': (notificationId: string) => void
  'notification-v1:response': (notificationId: string) => void
  'notification-v1:clear': () => void
}> {
  constructor(
    private readonly logger: LoggerFactory,
    private readonly repository: NotificationRepository,
    private readonly fetcher: NotificationFetcher,
    private readonly users: VRChatUsers,
    private readonly pipeline: VRChatPipeline
  ) {
    super('VRChatNotifications:EventBinding')
  }

  public bindEvents() {
    this.pipeline.on('message', (message: PipelineEventMessage) => {
      this.handlePipeMessage(message)
    })

    this.on('notification-v1:new', (notification) => {
      this.logger.debug(
        'received new notification(v1)',
        notification.type,
        notification.senderType,
        notification.senderName,
        notification.message
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
        break
      }

      case PipelineEvents.NotificationV2Delete: {
        break
      }

      case PipelineEvents.NotificationV2Update: {
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
    this.emit('notification-v1:new', processedNotification)
  }

  private async handleSeeNotification(notificationId: string): Promise<void> {
    this.changeNotificationAsSeen(notificationId, true)
    this.emit('notification-v1:see', notificationId)
  }

  private async handleHideNotification(notificationId: string): Promise<void> {
    this.changeNotificationAsResponded(notificationId)
    this.emit('notification-v1:hide', notificationId)
  }

  private async handleResponseNotification({
    notificationId
  }: PipelineEventResponseNotification): Promise<void> {
    this.changeNotificationAsResponded(notificationId)
    this.emit('notification-v1:response', notificationId)
  }

  private async handleClearNotification(): Promise<void> {
    this.repository.clearNotifications('v1')
    this.emit('notification-v1:clear')
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
