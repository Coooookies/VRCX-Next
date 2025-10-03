import {
  NotificationGlobalType,
  NotificationSenderType
} from '@shared/definition/vrchat-notifications'
import { NotificationType, NotificationV2Type } from '@shared/definition/vrchat-api-response'
import type { NotificationEntity } from '../database/entities/vrchat-notifications'
import type {
  NotificationBaseInformation,
  NotificationInformation
} from '@shared/definition/vrchat-notifications'
import type {
  Notification,
  NotificationV2,
  NotificationV2DataEventAnnouncement,
  NotificationV2DataGroupAnnouncement
} from '@shared/definition/vrchat-api-response'

export function toNotificationV1BaseInformation(
  notification: Notification
): NotificationBaseInformation {
  let type: NotificationGlobalType

  switch (notification.type) {
    case NotificationType.Invite: {
      type = NotificationGlobalType.InviteV1
      break
    }
    case NotificationType.InviteResponse: {
      type = NotificationGlobalType.InviteResponseV1
      break
    }
    case NotificationType.RequestInvite: {
      type = NotificationGlobalType.RequestInviteV1
      break
    }
    case NotificationType.RequestInviteResponse: {
      type = NotificationGlobalType.RequestInviteResponseV1
      break
    }
    case NotificationType.Votetokick: {
      type = NotificationGlobalType.VotetokickV1
      break
    }
    case NotificationType.FriendRequest: {
      type = NotificationGlobalType.FriendRequestV1
      break
    }
    case NotificationType.Message: {
      type = NotificationGlobalType.MessageV1
      break
    }
  }

  return {
    notificationId: notification.id,
    type,
    title: notification.message,
    message: notification.message,
    thumbnailImageUrl: null,
    senderId: notification.senderUserId,
    senderType: NotificationSenderType.User,
    isRead: notification.seen || false,
    createdAt: new Date(notification.created_at),
    version: 'v1',
    raw: {
      ...notification,
      details:
        typeof notification.details === 'string'
          ? JSON.parse(notification.details)
          : notification.details
    }
  } as NotificationBaseInformation
}

export function toNotificationV2BaseInformation(
  notification: NotificationV2
): NotificationBaseInformation {
  let type: NotificationGlobalType = NotificationGlobalType.UnknownV2
  let senderId: string = ''
  let senderType: NotificationSenderType = NotificationSenderType.Unknown

  switch (notification.type) {
    case NotificationV2Type.GroupAnnouncement: {
      const data = notification.data as NotificationV2DataGroupAnnouncement
      type = NotificationGlobalType.GroupAnnouncementV2
      senderId = data.groupId
      senderType = NotificationSenderType.Group
      break
    }
    case NotificationV2Type.GroupInformative: {
      type = NotificationGlobalType.GroupInformativeV2
      break
    }
    case NotificationV2Type.GroupInvite: {
      type = NotificationGlobalType.GroupInviteV2

      // group:grp_00000000-0000-0000-0000-000000000000"
      const linkPrefix = 'group:'
      if (notification.link.startsWith(linkPrefix)) {
        senderId = notification.link.replace(linkPrefix, '')
        senderType = NotificationSenderType.Group
      }
      break
    }
    case NotificationV2Type.GroupJoinRequest: {
      type = NotificationGlobalType.GroupJoinRequestV2
      break
    }
    case NotificationV2Type.GroupQueueReady: {
      type = NotificationGlobalType.GroupQueueReadyV2
      break
    }
    case NotificationV2Type.GroupTransfer: {
      type = NotificationGlobalType.GroupTransferV2
      break
    }
    case NotificationV2Type.EventAnnouncement: {
      const data = notification.data as NotificationV2DataEventAnnouncement
      type = NotificationGlobalType.EventAnnouncementV2
      senderId = data.ownerId
      if (data.ownerId.startsWith('grp_')) senderType = NotificationSenderType.Group
      else if (data.ownerId.startsWith('usr_')) senderType = NotificationSenderType.User
      else senderType = NotificationSenderType.Unknown
      break
    }
  }

  return {
    notificationId: notification.id,
    type,
    title: notification.title,
    message: notification.message,
    thumbnailImageUrl: notification.imageUrl || null,
    senderId,
    senderType,
    isRead: notification.seen || false,
    createdAt: new Date(notification.createdAt),
    version: 'v2',
    raw: notification
  } as NotificationBaseInformation
}

export function toNotificationEntity(
  notification: NotificationInformation,
  refUserId: string
): NotificationEntity {
  return {
    notificationId: notification.notificationId,
    refUserId,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    isRead: notification.isRead,
    thumbnailImageUrl: notification.thumbnailImageUrl || undefined,
    senderId: notification.senderId || undefined,
    senderName: notification.senderName || undefined,
    senderType: notification.senderType,
    version: notification.version,
    raw: notification.raw,
    createdAt: notification.createdAt
  }
}

export function toNotificationDependency(
  notification: NotificationBaseInformation | NotificationBaseInformation[]
) {
  const notifications = Array.isArray(notification) ? notification : [notification]
  const userIds = new Set<string>()
  const groupIds = new Set<string>()

  for (const currentNotification of notifications) {
    if (
      currentNotification.senderId &&
      currentNotification.senderType === NotificationSenderType.User
    ) {
      userIds.add(currentNotification.senderId)
    }

    if (
      currentNotification.senderId &&
      currentNotification.senderType === NotificationSenderType.Group
    ) {
      groupIds.add(currentNotification.senderId)
    }
  }

  return {
    userIds: [...userIds],
    groupIds: [...groupIds]
  }
}
