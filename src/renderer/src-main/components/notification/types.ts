import {
  NotificationSenderType,
  NotificationVersion
} from '@shared/definition/vrchat-notifications'

export interface NotificationBaseProps {
  notificationId: string
  title: string
  message: string
  isRead: boolean
  thumbnailImageUrl: string | null
  senderId: string | null
  senderType: NotificationSenderType
  senderName: string | null
  senderAvatarFileId: string | null
  senderAvatarFileVersion: number | null
  version: NotificationVersion
  createdAt: Date
}
