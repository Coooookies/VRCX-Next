import type { NotificationInformation } from '@shared/definition/vrchat-notifications'
import type { VRChatUsers } from '../vrchat-users'
import type { NotificationRepository } from './repository'

export class NotificationHistory {
  constructor(
    private readonly repository: NotificationRepository,
    private readonly users: VRChatUsers
  ) {}

  public saveNotification(notification: NotificationInformation | NotificationInformation[]) {
    if (!this.users.activeUser) {
      return
    }

    return this.repository.saveNotification(notification, this.users.activeUser.userId)
  }
}
