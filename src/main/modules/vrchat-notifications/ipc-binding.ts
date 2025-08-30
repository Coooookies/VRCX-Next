import type { IPCModule } from '../ipc'
import { NotificationOperation } from './operation'
import type { NotificationRepository } from './repository'

export class NotificationIPCBinding {
  constructor(
    private ipc: IPCModule,
    private repository: NotificationRepository,
    private operation: NotificationOperation
  ) {}

  public bindEvents() {
    this.repository.on('notification:remote:insert', (notifications) => {
      this.ipc.send('vrchat-notifications:notification:list-insert', notifications)
    })

    this.repository.on('notification:remote:update', (notifications) => {
      this.ipc.send('vrchat-notifications:notification:list-update', notifications)
    })

    this.repository.on('notification:remote:delete', (notificationIds) => {
      this.ipc.send('vrchat-notifications:notification:list-delete', notificationIds)
    })

    this.repository.on('notification:remote:clear', (version) => {
      this.ipc.send('vrchat-notifications:notification:list-clear', version)
    })
  }

  public bindInvokes() {
    this.ipc.listener.handle('vrchat-notifications:get-notifications', () => {
      return this.repository.getAllNotifications()
    })

    this.ipc.listener.handle(
      'vrchat-notifications:mark-notificationv1-as-read',
      (_, notificationId) => {
        return this.operation.markNotificationV1AsRead(notificationId).then(() => {})
      }
    )

    this.ipc.listener.handle('vrchat-notifications:delete-notification-v1', (_, notificationId) => {
      return this.operation.deleteNotificationV1(notificationId).then(() => {})
    })

    this.ipc.listener.handle('vrchat-notifications:delete-notification-v2', (_, notificationId) => {
      return this.operation.deleteNotificationV2(notificationId).then(() => {})
    })

    this.ipc.listener.handle('vrchat-notifications:clear-notifications', () => {
      return this.operation.clearNotifications().then(() => {})
    })

    this.ipc.listener.handle(
      'vrchat-notifications:respond-notification-v2',
      (_, notificationId, type, data) => {
        return this.operation.respondNotificationV2(notificationId, type, data).then(() => {})
      }
    )
  }
}
