import { NotificationType } from './vrchat-api-response-community'
import type { LocationInstance } from './vrchat-instances'
import type { UserSummary } from './vrchat-users'
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

export interface NotificationInviteInformation {
  type: typeof NotificationType.Invite
  detail: {
    inviteMessage?: string
    location: LocationInstance | null
  }
}

export interface NotificationInviteResponseInformation {
  type: typeof NotificationType.InviteResponse
  detail: NotificationDetailInviteResponse
}

export interface NotificationRequestInviteInformation {
  type: typeof NotificationType.RequestInvite
  detail: NotificationDetailRequestInvite
}

export interface NotificationRequestInviteResponseInformation {
  type: typeof NotificationType.RequestInviteResponse
  detail: NotificationDetailRequestInviteResponse
}

export interface NotificationVoteToKickInformation {
  type: typeof NotificationType.Votetokick
  detail: {
    initiator: UserSummary | null
    target: UserSummary | null
  }
}

export interface NotificationFriendRequestInformation {
  type: typeof NotificationType.FriendRequest
  detail: never
}

export interface NotificationMessageInformation {
  type: typeof NotificationType.Message
  detail: never
}

export type NotificationInformation = NotificationBase &
  (
    | NotificationInviteInformation
    | NotificationInviteResponseInformation
    | NotificationRequestInviteInformation
    | NotificationRequestInviteResponseInformation
    | NotificationVoteToKickInformation
    | NotificationFriendRequestInformation
    | NotificationMessageInformation
  )
