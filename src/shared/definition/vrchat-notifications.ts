import {
  NotificationDetailInvite,
  NotificationDetailInviteResponse,
  NotificationDetailRequestInvite,
  NotificationDetailRequestInviteResponse,
  NotificationDetailVoteToKick,
  NotificationType,
  NotificationV1,
  NotificationV2,
  NotificationV2DataEventAnnouncement,
  NotificationV2DataGroupAnnouncement,
  NotificationV2DataGroupInvite,
  NotificationV2DataGroupJoinRequest,
  NotificationV2GroupCategory,
  NotificationV2Type
} from './vrchat-api-response'

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
  UnknownV1: 'v1.unknown',
  GroupAnnouncementV2: 'v2.group-announcement',
  GroupInviteV2: 'v2.group-invite',
  GroupInformativeV2: 'v2.group-informative',
  GroupJoinRequestV2: 'v2.group-join-request',
  GroupTransferV2: 'v2.group-transfer',
  GroupQueueReadyV2: 'v2.group-queue-ready',
  EventAnnouncementV2: 'v2.event-announcement',
  UnknownV2: 'v2.unknown'
} as const

export type NotificationGlobalType =
  (typeof NotificationGlobalType)[keyof typeof NotificationGlobalType]

export type NotificationGlobalRawInformation = {
  [NotificationGlobalType.InviteV1]: NotificationV1<
    typeof NotificationType.Invite,
    NotificationDetailInvite
  >
  [NotificationGlobalType.InviteResponseV1]: NotificationV1<
    typeof NotificationType.InviteResponse,
    NotificationDetailInviteResponse
  >
  [NotificationGlobalType.RequestInviteV1]: NotificationV1<
    typeof NotificationType.RequestInvite,
    NotificationDetailRequestInvite
  >
  [NotificationGlobalType.RequestInviteResponseV1]: NotificationV1<
    typeof NotificationType.RequestInviteResponse,
    NotificationDetailRequestInviteResponse
  >
  [NotificationGlobalType.VotetokickV1]: NotificationV1<
    typeof NotificationType.Votetokick,
    NotificationDetailVoteToKick
  >
  [NotificationGlobalType.FriendRequestV1]: NotificationV1<
    typeof NotificationType.FriendRequest,
    unknown
  >
  [NotificationGlobalType.MessageV1]: NotificationV1<typeof NotificationType.Message, unknown>
  [NotificationGlobalType.UnknownV1]: NotificationV1<unknown, unknown>
  [NotificationGlobalType.GroupAnnouncementV2]: NotificationV2<
    typeof NotificationV2Type.GroupAnnouncement,
    typeof NotificationV2GroupCategory.SoocialGroup,
    NotificationV2DataGroupAnnouncement
  >
  [NotificationGlobalType.GroupInviteV2]: NotificationV2<
    typeof NotificationV2Type.GroupInvite,
    typeof NotificationV2GroupCategory.SoocialGroup,
    NotificationV2DataGroupInvite
  >
  [NotificationGlobalType.GroupInformativeV2]: NotificationV2<
    typeof NotificationV2Type.GroupInformative,
    typeof NotificationV2GroupCategory.SoocialGroup,
    unknown
  >
  [NotificationGlobalType.GroupJoinRequestV2]: NotificationV2<
    typeof NotificationV2Type.GroupJoinRequest,
    typeof NotificationV2GroupCategory.SoocialGroup,
    NotificationV2DataGroupJoinRequest
  >
  [NotificationGlobalType.GroupTransferV2]: NotificationV2<
    typeof NotificationV2Type.GroupTransfer,
    typeof NotificationV2GroupCategory.SoocialGroup,
    unknown
  >
  [NotificationGlobalType.GroupQueueReadyV2]: NotificationV2<
    typeof NotificationV2Type.GroupQueueReady,
    typeof NotificationV2GroupCategory.SoocialGroup,
    unknown
  >
  [NotificationGlobalType.EventAnnouncementV2]: NotificationV2<
    typeof NotificationV2Type.EventAnnouncement,
    typeof NotificationV2GroupCategory.Event,
    NotificationV2DataEventAnnouncement
  >
  [NotificationGlobalType.UnknownV2]: NotificationV2<unknown, unknown, unknown>
}

export type NotificationBaseInformation = {
  [K in keyof NotificationGlobalRawInformation]: {
    notificationId: string
    type: K
    title: string
    message: string
    isRead: boolean
    thumbnailImageUrl: string | null
    senderId: string | null
    senderType: NotificationSenderType
    raw: NotificationGlobalRawInformation[K]
    version: NotificationVersion
    createdAt: Date
  }
}[keyof NotificationGlobalRawInformation]

export type NotificationInformation = NotificationBaseInformation & {
  senderName: string | null
  senderAvatarFileId: string | null
  senderAvatarFileVersion: number | null
}

export type NotificationVersion = 'v1' | 'v2' | 'all'

export const NotificationGlobalCategory = {
  Friends: 'friends',
  Groups: 'groups',
  Others: 'others'
} as const

export type NotificationGlobalCategory =
  (typeof NotificationGlobalCategory)[keyof typeof NotificationGlobalCategory]
