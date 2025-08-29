import type { IPCModule } from '../ipc'
import type { NotificationRepository } from './repository'

export class NotificationIPCBinding {
  constructor(
    private ipc: IPCModule,
    private repository: NotificationRepository
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
  }
}
