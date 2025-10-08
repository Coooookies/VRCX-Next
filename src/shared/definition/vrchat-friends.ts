import type { ReferenceAvatar } from './vrchat-avatars'
import type {
  LocationInstanceGroupType,
  LocationInstanceOverview,
  LocationInstancePublicType,
  LocationInstanceUserType
} from './vrchat-instances'
import type { UserInformationBase, UserSummary } from './vrchat-users'
import type { WorldSummary } from './vrchat-worlds'
import type { GroupSummary } from './vrchat-groups'

export interface BaseFriendInformation extends UserInformationBase {
  referenceAvatar: ReferenceAvatar
  order: number
  lastPlatform: string
  lastLoginDate: Date | null
  lastActivityDate: Date | null
}

export interface FriendInformation extends BaseFriendInformation {
  location: LocationInstanceOverview | null
}

export const FriendActivityEvents = {
  LocationChange: 'location-change',
  AvatarChange: 'avatar-change',
  DisplayNameChange: 'display-name-change',
  StatusChange: 'status-change',
  StatusDescriptionChange: 'status-description-change',
  BioChange: 'bio-change',
  TrustRankChange: 'trust-rank-change',
  IsSupporterChange: 'is-supporter-change'
}

export type FriendActivityEvents = (typeof FriendActivityEvents)[keyof typeof FriendActivityEvents]

export const FriendAttributeActivities = {
  DisplayName: 'displayName',
  Status: 'status',
  StatusDescription: 'statusDescription',
  Bio: 'bio',
  TrustRank: 'trustRank',
  IsSupporter: 'isSupporter',
  ReferenceAvatar: 'referenceAvatar'
} as const

export type FriendAttributeActivities =
  (typeof FriendAttributeActivities)[keyof typeof FriendAttributeActivities]

export interface FriendLocationActivityBase {
  worldId: string
  worldName?: string
  worldVersion?: number
  ownerId?: string
  ownerName?: string
  instanceId: string
  referenceWorld?: WorldSummary
}

export interface FriendLocationActivityNormalOverview extends FriendLocationActivityBase {
  instanceType: LocationInstancePublicType
}

export interface FriendLocationActivityGroupOverview extends FriendLocationActivityBase {
  instanceType: LocationInstanceGroupType
  referenceGroup?: GroupSummary
}

export interface FriendLocationActivityFriendOverview extends FriendLocationActivityBase {
  instanceType: LocationInstanceUserType
  referenceUser?: UserSummary
}

export type FriendLocationActivityOverview =
  | FriendLocationActivityNormalOverview
  | FriendLocationActivityGroupOverview
  | FriendLocationActivityFriendOverview
  | null // private instance

export interface FriendAvatarActivityOverview {
  avatarImagefileId: string
  avatarImagefileVersion: number
  avatarName?: string
}

export interface FriendCommonActivityOverview {
  beforeValue: string
  afterValue: string
}

export type FriendActivityEventDefinition = {
  [FriendActivityEvents.AvatarChange]: FriendAvatarActivityOverview
  [FriendActivityEvents.LocationChange]: FriendLocationActivityOverview
  [FriendActivityEvents.DisplayNameChange]: FriendCommonActivityOverview
  [FriendActivityEvents.StatusChange]: FriendCommonActivityOverview
  [FriendActivityEvents.StatusDescriptionChange]: FriendCommonActivityOverview
  [FriendActivityEvents.BioChange]: FriendCommonActivityOverview
  [FriendActivityEvents.TrustRankChange]: FriendCommonActivityOverview
  [FriendActivityEvents.IsSupporterChange]: FriendCommonActivityOverview
}

export type FriendActivity = {
  [K in FriendActivityEvents]: {
    activityId: string
    activityType: K
    friendUserId: string
    friendUser: UserSummary
    overview: FriendActivityEventDefinition[K]
    recordedAt: Date
  }
}[FriendActivityEvents]
