import type { Region } from './vrchat-api-response'
import type { GroupSummary } from './vrchat-groups'
import type { UserInformation, UserSummary } from './vrchat-users'

export const LocationInstancePublicType = {
  Public: 'public'
} as const

export type LocationInstancePublicType =
  (typeof LocationInstancePublicType)[keyof typeof LocationInstancePublicType]

export const LocationInstanceUserType = {
  FriendsPlus: 'friends+',
  Friends: 'friends',
  InvitePlus: 'invite+',
  Invite: 'invite'
} as const

export type LocationInstanceUserType =
  (typeof LocationInstanceUserType)[keyof typeof LocationInstanceUserType]

export const LocationInstanceGroupType = {
  GroupPublic: 'groupPublic',
  GroupPlus: 'group+',
  Group: 'group'
} as const

export type LocationInstanceGroupType =
  (typeof LocationInstanceGroupType)[keyof typeof LocationInstanceGroupType]

export type LocationInstanceType =
  | LocationInstancePublicType
  | LocationInstanceUserType
  | LocationInstanceGroupType

interface LocationInstanceBase {
  location: string
  worldId: string
  name: string
  region?: Region
}

export interface LocationInstancePublic extends LocationInstanceBase {
  type: LocationInstancePublicType
}

export interface LocationInstanceUser extends LocationInstanceBase {
  type: LocationInstanceUserType
  userId: string
}

export interface LocationInstanceGroup extends LocationInstanceBase {
  type: LocationInstanceGroupType
  groupId: string
  require18yo: boolean
}

export type LocationInstance = LocationInstancePublic | LocationInstanceUser | LocationInstanceGroup

interface LocationInstanceBaseSummary {
  location: string
  worldId: string
  worldName: string
  worldImageFileId: string
  worldImageFileVersion: number
  name: string
  region?: Region
}

export interface LocationInstancePublicSummary extends LocationInstanceBaseSummary {
  type: LocationInstancePublicType
}

export interface LocationInstanceUserSummary extends LocationInstanceBaseSummary {
  type: LocationInstanceUserType
  userId: string
}

export interface LocationInstanceGroupSummary extends LocationInstanceBaseSummary {
  type: LocationInstanceGroupType
  groupId: string
  groupName: string
  groupImageFileId: string
  groupImageFileVersion: number
  require18yo: boolean
}

export type LocationInstanceSummary =
  | LocationInstancePublicSummary
  | LocationInstanceUserSummary
  | LocationInstanceGroupSummary

export interface InstanceEventUser {
  userName: string
  userId: string
  user: UserSummary | null
}

export interface InstanceEventVoteKick {
  userName: string
}

export interface InstanceEventVideoPlaybackLoad {
  url: string
}

export interface InstanceEventVideoPlaybackError {
  reason: string
}

export const InstanceEvents = {
  UserLeave: 'user-leave',
  UserJoin: 'user-join',
  UserPresent: 'user-present',
  UserRemain: 'user-remain',
  VoteKick: 'vote-kick',
  VideoPlaybackLoad: 'video-playback-load',
  VideoPlaybackError: 'video-playback-error'
} as const

export type InstanceEvents = (typeof InstanceEvents)[keyof typeof InstanceEvents]
export type InstanceUserEvents =
  | typeof InstanceEvents.UserJoin
  | typeof InstanceEvents.UserLeave
  | typeof InstanceEvents.UserPresent
  | typeof InstanceEvents.UserRemain

export type InstanceEventDefinition = {
  [InstanceEvents.UserLeave]: InstanceEventUser
  [InstanceEvents.UserJoin]: InstanceEventUser
  [InstanceEvents.UserPresent]: InstanceEventUser
  [InstanceEvents.UserRemain]: InstanceEventUser
  [InstanceEvents.VoteKick]: InstanceEventVoteKick
  [InstanceEvents.VideoPlaybackLoad]: InstanceEventVideoPlaybackLoad
  [InstanceEvents.VideoPlaybackError]: InstanceEventVideoPlaybackError
}

export type InstanceEventMessage = {
  [K in InstanceEvents]: {
    type: K
    eventId: string
    content: InstanceEventDefinition[K]
    recordedAt: Date
  }
}[InstanceEvents]

export interface InstanceUser {
  userName: string
  userId: string
  joinedAt: Date
}
export interface InstanceUserWithInformation extends InstanceUser {
  user: UserInformation | null
}

export type LocationOwner =
  | {
      type: 'user'
      summary: UserSummary | null
    }
  | {
      type: 'group'
      summary: GroupSummary | null
    }
  | {
      type: 'public'
      summary: null
    }
