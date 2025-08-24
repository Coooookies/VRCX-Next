import { NotificationType } from '@shared/definition/vrchat-api-response-community'
import type {
  NotificationDetailInvite,
  NotificationDetailInviteResponse,
  NotificationDetailRequestInvite,
  NotificationDetailRequestInviteResponse,
  NotificationDetailVoteToKick
} from '@shared/definition/vrchat-api-response-community'

export interface NotificationOriginalBase {
  notificationId: string
  seen: boolean
  message: string
  senderUserId: string | null
  createdAt: Date
}

export interface NotificationOriginalInviteInformation {
  type: typeof NotificationType.Invite
  detail: NotificationDetailInvite
}

export interface NotificationOriginalInviteResponseInformation {
  type: typeof NotificationType.InviteResponse
  detail: NotificationDetailInviteResponse
}

export interface NotificationOriginalRequestInviteInformation {
  type: typeof NotificationType.RequestInvite
  detail: NotificationDetailRequestInvite
}

export interface NotificationOriginalRequestInviteResponseInformation {
  type: typeof NotificationType.RequestInviteResponse
  detail: NotificationDetailRequestInviteResponse
}

export interface NotificationOriginalVoteToKickInformation {
  type: typeof NotificationType.Votetokick
  detail: NotificationDetailVoteToKick
}

export interface NotificationOriginalFriendRequestInformation {
  type: typeof NotificationType.FriendRequest
  detail: never
}

export interface NotificationOriginalMessageInformation {
  type: typeof NotificationType.Message
  detail: never
}

export type NotificationOriginalInformation = NotificationOriginalBase &
  (
    | NotificationOriginalInviteInformation
    | NotificationOriginalInviteResponseInformation
    | NotificationOriginalRequestInviteInformation
    | NotificationOriginalRequestInviteResponseInformation
    | NotificationOriginalVoteToKickInformation
    | NotificationOriginalFriendRequestInformation
    | NotificationOriginalMessageInformation
  )
