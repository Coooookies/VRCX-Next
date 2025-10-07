import type { IPCModule } from '../ipc'
import type { NotificationHub } from './notification-hub'
import type { NotificationOperation } from './operation'

export class NotificationIPCBinding {
  constructor(
    private ipc: IPCModule,
    private hub: NotificationHub,
    private operation: NotificationOperation
  ) {
    this.bindEvents()
    this.bindInvokes()
  }

  private bindEvents() {
    this.hub.on('sync:present-notification', (notifications) => {
      this.ipc.send('vrchat-notifications:notifications:present', notifications)
    })

    this.hub.on('sync:update-notification', (notificationId, notification) => {
      this.ipc.send('vrchat-notifications:notifications:update', notificationId, notification)
    })

    this.hub.on('sync:append-notification', (notification) => {
      this.ipc.send('vrchat-notifications:notifications:append', notification)
    })

    this.hub.on('sync:remove-notification', (notificationId) => {
      this.ipc.send('vrchat-notifications:notifications:remove', notificationId)
    })

    this.hub.on('sync:clear-notification', (version) => {
      this.ipc.send('vrchat-notifications:notifications:clear', version)
    })
  }

  private bindInvokes() {
    this.ipc.listener.handle('vrchat-notifications:get-notifications', () => {
      return this.hub.notifications
    })

    this.ipc.listener.handle(
      'vrchat-notifications:mark-notification-as-read',
      (_, notificationId) => {
        return this.operation.markNotificationAsRead(notificationId).then(() => {})
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
