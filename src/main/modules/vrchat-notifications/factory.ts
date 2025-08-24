import { parseLocation } from '../vrchat-worlds/location-parser'
import { isGroupInstance } from '../vrchat-worlds/factory'
import { NotificationType } from '@shared/definition/vrchat-api-response'
import type { NotificationOriginalInformation } from './types'
import type { Notification } from '@shared/definition/vrchat-api-response'
import type { LocationInstanceGroup } from '@shared/definition/vrchat-instances'

export function toBaseNotificationInformation(
  notification: Notification
): NotificationOriginalInformation {
  return {
    notificationId: notification.id,
    type: notification.type,
    seen: notification.seen || false,
    message: notification.message,
    senderUserId: notification.senderUserId,
    createdAt: new Date(notification.created_at),
    detail:
      typeof notification.details === 'string'
        ? JSON.parse(notification.details)
        : notification.details
  } as NotificationOriginalInformation
}

export function toNotificationDependency(notifications: Notification[]) {
  const baseNotifications = notifications.map((n) => toBaseNotificationInformation(n))
  const userIds: string[] = []
  const worldIds: string[] = []
  const groupIds: string[] = []

  for (const notification of baseNotifications) {
    if (notification.senderUserId) {
      userIds.push(notification.senderUserId)
    }

    switch (notification.type) {
      case NotificationType.Invite: {
        const detail = notification.detail
        const location = parseLocation(detail.worldId)
        if (location) {
          worldIds.push(location.worldId)
          if (isGroupInstance(location)) {
            const groupLocation = location as LocationInstanceGroup
            groupIds.push(groupLocation.groupId)
          }
        }
        break
      }
      case NotificationType.Votetokick: {
        const detail = notification.detail
        if (detail.initiatorUserId) userIds.push(detail.initiatorUserId)
        if (detail.userToKickId) userIds.push(detail.userToKickId)
        break
      }
    }
  }

  return {
    userIds: [...new Set(userIds)],
    worldIds: [...new Set(worldIds)],
    groupIds: [...new Set(groupIds)]
  }
}
