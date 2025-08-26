import { NotificationType } from '@shared/definition/vrchat-api-response-community'
import type { NotificationSenderType } from '@shared/definition/vrchat-notifications'
import type {
  NotificationDetailInvite,
  NotificationDetailInviteResponse,
  NotificationDetailRequestInvite,
  NotificationDetailRequestInviteResponse,
  NotificationDetailVoteToKick
} from '@shared/definition/vrchat-api-response-community'
import {
  NotificationV2DataEventAnnouncement,
  NotificationV2DataGroupAnnouncement,
  NotificationV2DataGroupInvite,
  NotificationV2DataGroupJoinRequest,
  NotificationV2Responses,
  NotificationV2Type
} from '@shared/definition/vrchat-api-response-replenish'

export interface NotificationOriginalBase {
  notificationId: string
  seen: boolean
  message: string
  senderUserId: string | null
  createdAt: Date
}

export interface NotificationOriginalInviteInformation extends NotificationOriginalBase {
  type: typeof NotificationType.Invite
  detail: NotificationDetailInvite
}

export interface NotificationOriginalInviteResponseInformation extends NotificationOriginalBase {
  type: typeof NotificationType.InviteResponse
  detail: NotificationDetailInviteResponse
}

export interface NotificationOriginalRequestInviteInformation extends NotificationOriginalBase {
  type: typeof NotificationType.RequestInvite
  detail: NotificationDetailRequestInvite
}

export interface NotificationOriginalRequestInviteResponseInformation
  extends NotificationOriginalBase {
  type: typeof NotificationType.RequestInviteResponse
  detail: NotificationDetailRequestInviteResponse
}

export interface NotificationOriginalVoteToKickInformation extends NotificationOriginalBase {
  type: typeof NotificationType.Votetokick
  detail: NotificationDetailVoteToKick
}

export interface NotificationOriginalFriendRequestInformation extends NotificationOriginalBase {
  type: typeof NotificationType.FriendRequest
  detail: never
}

export interface NotificationOriginalMessageInformation extends NotificationOriginalBase {
  type: typeof NotificationType.Message
  detail: never
}

export type NotificationOriginalInformation =
  | NotificationOriginalInviteInformation
  | NotificationOriginalInviteResponseInformation
  | NotificationOriginalRequestInviteInformation
  | NotificationOriginalRequestInviteResponseInformation
  | NotificationOriginalVoteToKickInformation
  | NotificationOriginalFriendRequestInformation
  | NotificationOriginalMessageInformation

export interface NotificationV2OriginalBase {
  notificationId: string
  seen: boolean
  title: string
  message: string
  senderId: string | null
  senderType: NotificationSenderType
  relatedNotificationId: string | null
  responses: NotificationV2Responses[]
  createdAt: Date
}

export interface NotificationV2OriginalGroupAnnouncementInformation
  extends NotificationV2OriginalBase {
  type: typeof NotificationV2Type.GroupAnnouncement
  detail: NotificationV2DataGroupAnnouncement & {
    thumbnailUrl: string
  }
}

export interface NotificationV2OriginalGroupJoinRequestInformation
  extends NotificationV2OriginalBase {
  type: typeof NotificationV2Type.GroupJoinRequest
  detail: NotificationV2DataGroupJoinRequest
}

export interface NotificationV2OriginalGroupInviteInformation extends NotificationV2OriginalBase {
  type: typeof NotificationV2Type.GroupInvite
  detail: NotificationV2DataGroupInvite
}

export interface NotificationV2OriginalGroupInformativeInformation
  extends NotificationV2OriginalBase {
  type: typeof NotificationV2Type.GroupInformative
  detail: unknown
}

export interface NotificationV2OriginalGroupTransferInformation extends NotificationV2OriginalBase {
  type: typeof NotificationV2Type.GroupTransfer
  detail: unknown
}

export interface NotificationV2OriginalGroupQueueReadyInformation
  extends NotificationV2OriginalBase {
  type: typeof NotificationV2Type.GroupQueueReady
  detail: unknown
}

export interface NotificationV2OriginalEventAnnouncementInformation
  extends NotificationV2OriginalBase {
  type: typeof NotificationV2Type.EventAnnouncement
  detail: NotificationV2DataEventAnnouncement & {
    thumbnailUrl: string
  }
}

export type NotificationV2OriginalInformation =
  | NotificationV2OriginalGroupAnnouncementInformation
  | NotificationV2OriginalGroupJoinRequestInformation
  | NotificationV2OriginalGroupInviteInformation
  | NotificationV2OriginalGroupInformativeInformation
  | NotificationV2OriginalGroupTransferInformation
  | NotificationV2OriginalGroupQueueReadyInformation
  | NotificationV2OriginalEventAnnouncementInformation
