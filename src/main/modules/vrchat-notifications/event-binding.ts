import Nanobus from 'nanobus'
import { toNotificationInformation } from './factory'
import { PipelineEvents } from '@shared/definition/vrchat-pipeline'
import type { LoggerFactory } from '@main/logger'
import type { VRChatPipeline } from '../vrchat-pipeline'
import type {
  PipelineEventMessage,
  PipelineEventResponseNotification
} from '@shared/definition/vrchat-pipeline'
import type { NotificationRepository } from './repository'
import type { Notification } from '@shared/definition/vrchat-api-response'
import type { NotificationInformation } from '@shared/definition/vrchat-notifications'

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
        notification.fromUserId,
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
    const info = toNotificationInformation(notification)
    this.repository.saveRemoteNotificationV1(info)
    this.emit('notification-v1:new', info)
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
    this.repository.clearRemoteNotificationsV1()
    this.emit('notification-v1:clear')
  }

  private async changeNotificationAsSeen(notificationId: string, seen: boolean): Promise<void> {
    const notification = this.repository.getRemoteNotificationV1(notificationId)
    if (notification) {
      this.repository.saveRemoteNotificationV1({ ...notification, seen })
    }
  }

  private async changeNotificationAsResponded(notificationId: string): Promise<void> {
    this.repository.deleteRemoteNotificationV1(notificationId)
  }
}
