import type { Region } from './vrchat-api-response'
import type { GroupSummary } from './vrchat-groups'
import type { UserInformation, UserSummary } from './vrchat-users'
import { WorldSummary } from './vrchat-worlds'

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

export interface LocationInstanceBaseOverview {
  isTraveling: boolean
  arrivedAt: Date
  referenceWorld?: WorldSummary
}

export interface LocationInstanceNormalOverview extends LocationInstanceBaseOverview {
  category: typeof InstanceAccessCategory.Public
  instance: LocationInstancePublic
}

export interface LocationInstanceGroupOverview extends LocationInstanceBaseOverview {
  category: typeof InstanceAccessCategory.Group
  instance: LocationInstanceGroup
  referenceGroup?: GroupSummary
}

export interface LocationInstanceFriendOverview extends LocationInstanceBaseOverview {
  category: typeof InstanceAccessCategory.Friend
  instance: LocationInstanceUser
  referenceUser?: UserSummary
}

export type LocationInstanceOverview =
  | LocationInstanceNormalOverview
  | LocationInstanceGroupOverview
  | LocationInstanceFriendOverview

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

export const InstanceAccessCategory = {
  Friend: 'friend',
  Group: 'group',
  Public: 'public'
} as const

export type InstanceAccessCategory =
  (typeof InstanceAccessCategory)[keyof typeof InstanceAccessCategory]

export type InstanceOwner =
  | {
      type: typeof InstanceAccessCategory.Friend
      summary: UserSummary | null
    }
  | {
      type: typeof InstanceAccessCategory.Group
      summary: GroupSummary | null
    }
  | {
      type: typeof InstanceAccessCategory.Public
      summary: null
    }
