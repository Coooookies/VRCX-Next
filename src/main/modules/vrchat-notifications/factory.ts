import { parseLocation } from '../vrchat-worlds/location-parser'
import { isGroupInstance } from '../vrchat-worlds/factory'
import { NotificationType, NotificationV2Type } from '@shared/definition/vrchat-api-response'
import { NotificationSenderType } from '@shared/definition/vrchat-notifications'
import type { Notification, NotificationV2 } from '@shared/definition/vrchat-api-response'
import type { LocationInstanceGroup } from '@shared/definition/vrchat-instances'
import type {
  NotificationOriginalInformation,
  NotificationV2OriginalBase,
  NotificationV2OriginalInformation
} from './types'

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

export function toBaseNotificationV2Information(
  notification: NotificationV2
): NotificationV2OriginalInformation {
  let senderType: NotificationSenderType = NotificationSenderType.Unknown
  let senderId: string | null = null

  switch (notification.type) {
    case NotificationV2Type.GroupAnnouncement: {
      senderType = NotificationSenderType.Group
      senderId = notification.data.groupId
      break
    }
    case NotificationV2Type.EventAnnouncement: {
      senderId = notification.data.ownerId
      if (notification.data.ownerId.startsWith('grp_')) {
        senderType = NotificationSenderType.Group
      } else if (notification.data.ownerId.startsWith('usr_')) {
        senderType = NotificationSenderType.User
      } else {
        senderType = NotificationSenderType.Unknown
      }
    }
  }

  const base: NotificationV2OriginalBase = {
    notificationId: notification.id,
    seen: notification.seen || false,
    title: notification.title,
    message: notification.message,
    relatedNotificationId: notification.relatedNotificationsId || null,
    responses: notification.responses,
    createdAt: new Date(notification.createdAt),
    senderType,
    senderId
  }

  switch (notification.type) {
    case NotificationV2Type.EventAnnouncement: {
      return {
        ...base,
        type: notification.type,
        detail: {
          ...notification.data,
          thumbnailUrl: notification.imageUrl || ''
        }
      }
    }
    case NotificationV2Type.GroupAnnouncement: {
      return {
        ...base,
        type: notification.type,
        detail: {
          ...notification.data,
          thumbnailUrl: notification.imageUrl || ''
        }
      }
    }
    case NotificationV2Type.GroupInvite: {
      return {
        ...base,
        type: notification.type,
        detail: notification.data
      }
    }
    case NotificationV2Type.GroupJoinRequest: {
      return {
        ...base,
        type: notification.type,
        detail: notification.data
      }
    }
    case NotificationV2Type.GroupInformative: {
      return {
        ...base,
        type: notification.type,
        detail: notification.data
      }
    }
    case NotificationV2Type.GroupQueueReady: {
      return {
        ...base,
        type: notification.type,
        detail: notification.data
      }
    }
    case NotificationV2Type.GroupTransfer: {
      return {
        ...base,
        type: notification.type,
        detail: notification.data
      }
    }
  }
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
