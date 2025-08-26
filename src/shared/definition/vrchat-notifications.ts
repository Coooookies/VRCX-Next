import { NotificationType } from './vrchat-api-response-community'
import {
  NotificationV2DataEventAnnouncement,
  NotificationV2DataGroupAnnouncement,
  NotificationV2DataGroupInvite,
  NotificationV2DataGroupJoinRequest,
  NotificationV2Responses,
  NotificationV2Type
} from './vrchat-api-response'
import type { LocationInstance } from './vrchat-instances'
import type { UserSummary } from './vrchat-users'
import type { GroupSummary } from './vrchat-groups'
import type {
  NotificationDetailInviteResponse,
  NotificationDetailRequestInvite,
  NotificationDetailRequestInviteResponse
} from './vrchat-api-response-community'

export interface NotificationBase {
  notificationId: string
  seen: boolean
  message: string
  sender: UserSummary | null
  createdAt: Date
}

export interface NotificationInviteInformation extends NotificationBase {
  type: typeof NotificationType.Invite
  detail: {
    inviteMessage?: string
    location: LocationInstance | null
  }
}

export interface NotificationInviteResponseInformation extends NotificationBase {
  type: typeof NotificationType.InviteResponse
  detail: NotificationDetailInviteResponse
}

export interface NotificationRequestInviteInformation extends NotificationBase {
  type: typeof NotificationType.RequestInvite
  detail: NotificationDetailRequestInvite
}

export interface NotificationRequestInviteResponseInformation extends NotificationBase {
  type: typeof NotificationType.RequestInviteResponse
  detail: NotificationDetailRequestInviteResponse
}

export interface NotificationVoteToKickInformation extends NotificationBase {
  type: typeof NotificationType.Votetokick
  detail: {
    initiator: UserSummary | null
    target: UserSummary | null
  }
}

export interface NotificationFriendRequestInformation extends NotificationBase {
  type: typeof NotificationType.FriendRequest
  detail: never
}

export interface NotificationMessageInformation extends NotificationBase {
  type: typeof NotificationType.Message
  detail: never
}

export type NotificationInformation =
  | NotificationInviteInformation
  | NotificationInviteResponseInformation
  | NotificationRequestInviteInformation
  | NotificationRequestInviteResponseInformation
  | NotificationVoteToKickInformation
  | NotificationFriendRequestInformation
  | NotificationMessageInformation

export interface NotificationV2Base {
  notificationId: string
  seen: boolean
  title: string
  message: string
  senderType: NotificationSenderType
  relatedNotificationId: string | null
  responses: NotificationV2Responses[]
  createdAt: Date
}

export type NotificationV2UserBase = NotificationV2Base & {
  sender: UserSummary
  senderType: typeof NotificationSenderType.User
}

export type NotificationV2GroupBase = NotificationV2Base & {
  sender: GroupSummary
  senderType: typeof NotificationSenderType.Group
}

export type NotificationV2SystemBase = NotificationV2Base & {
  sender: unknown
  senderType: typeof NotificationSenderType.System
}

export type NotificationV2UnknownBase = NotificationV2Base & {
  sender: unknown
  senderType: typeof NotificationSenderType.Unknown
}

export type NotificationV2SenderBase =
  | NotificationV2UserBase
  | NotificationV2GroupBase
  | NotificationV2SystemBase
  | NotificationV2UnknownBase

export type NotificationV2GroupAnnouncementInformation = NotificationV2SenderBase & {
  type: typeof NotificationV2Type.GroupAnnouncement
  detail: NotificationV2DataGroupAnnouncement & {
    thumbnailUrl: string
  }
}

export type NotificationV2GroupJoinRequestInformation = NotificationV2SenderBase & {
  type: typeof NotificationV2Type.GroupJoinRequest
  detail: NotificationV2DataGroupJoinRequest
}

export type NotificationV2GroupInviteInformation = NotificationV2SenderBase & {
  type: typeof NotificationV2Type.GroupInvite
  detail: NotificationV2DataGroupInvite
}

export type NotificationV2GroupInformativeInformation = NotificationV2SenderBase & {
  type: typeof NotificationV2Type.GroupInformative
  detail: unknown
}

export type NotificationV2GroupTransferInformation = NotificationV2SenderBase & {
  type: typeof NotificationV2Type.GroupTransfer
  detail: unknown
}

export type NotificationV2GroupQueueReadyInformation = NotificationV2SenderBase & {
  type: typeof NotificationV2Type.GroupQueueReady
  detail: unknown
}

export type NotificationV2EventAnnouncementInformation = NotificationV2SenderBase & {
  type: typeof NotificationV2Type.EventAnnouncement
  detail: NotificationV2DataEventAnnouncement & {
    thumbnailUrl: string
  }
}

export type NotificationV2Information =
  | NotificationV2GroupAnnouncementInformation
  | NotificationV2GroupJoinRequestInformation
  | NotificationV2GroupInviteInformation
  | NotificationV2GroupInformativeInformation
  | NotificationV2GroupTransferInformation
  | NotificationV2GroupQueueReadyInformation
  | NotificationV2EventAnnouncementInformation

export const NotificationSenderType = {
  User: 'user',
  Group: 'group',
  System: 'system',
  Unknown: 'unknown'
} as const

export type NotificationSenderType =
  (typeof NotificationSenderType)[keyof typeof NotificationSenderType]

export const NotificationGlobalType = {
  InviteV1: 'v1.invite',
  InviteResponseV1: 'v1.invite-response',
  RequestInviteV1: 'v1.request-invite',
  RequestInviteResponseV1: 'v1.request-invite-response',
  VotetokickV1: 'v1.votetokick',
  FriendRequestV1: 'v1.friend-request',
  MessageV1: 'v1.message',
  GroupAnnouncementV2: 'v2.group-announcement',
  GroupInviteV2: 'v2.group-invite',
  GroupInformativeV2: 'v2.group-informative',
  GroupJoinRequestV2: 'v2.group-join-request',
  GroupTransferV2: 'v2.group-transfer',
  GroupQueueReady: 'v2.group-queue-ready',
  EventAnnouncementV2: 'v2.event-announcement'
} as const

export type NotificationGlobalType =
  (typeof NotificationGlobalType)[keyof typeof NotificationGlobalType]

export type NotificationGlobalRawInformation = {
  [NotificationGlobalType.InviteV1]: NotificationInviteInformation
  [NotificationGlobalType.InviteResponseV1]: NotificationInviteResponseInformation
  [NotificationGlobalType.RequestInviteV1]: NotificationRequestInviteInformation
  [NotificationGlobalType.RequestInviteResponseV1]: NotificationRequestInviteResponseInformation
  [NotificationGlobalType.VotetokickV1]: NotificationVoteToKickInformation
  [NotificationGlobalType.FriendRequestV1]: NotificationFriendRequestInformation
  [NotificationGlobalType.MessageV1]: NotificationMessageInformation
  [NotificationGlobalType.GroupAnnouncementV2]: NotificationV2GroupAnnouncementInformation
  [NotificationGlobalType.GroupInviteV2]: NotificationV2GroupInviteInformation
  [NotificationGlobalType.GroupInformativeV2]: NotificationV2GroupInformativeInformation
  [NotificationGlobalType.GroupJoinRequestV2]: NotificationV2GroupJoinRequestInformation
  [NotificationGlobalType.GroupTransferV2]: NotificationV2GroupTransferInformation
  [NotificationGlobalType.GroupQueueReady]: NotificationV2GroupQueueReadyInformation
  [NotificationGlobalType.EventAnnouncementV2]: NotificationV2EventAnnouncementInformation
}
