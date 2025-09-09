import type { Region } from './vrchat-api-response'
import type { UserSummary } from './vrchat-users'

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

export const InstanceUserActivityType = {
  Leave: 'leave',
  Join: 'join',
  Present: 'present',
  Remain: 'remain'
} as const

export type InstanceUserActivityType =
  (typeof InstanceUserActivityType)[keyof typeof InstanceUserActivityType]

export interface InstanceUser {
  userName: string
  userId: string
  joinedAt: Date
}

export interface InstanceUserActivity {
  userName: string
  userId: string
  type: 'leave' | 'join' | 'present' | 'remain'
  recordedAt: Date
}

export interface InstanceUserSummary extends InstanceUser {
  userSummary: UserSummary | null
}

export interface InstanceUserActivitySummary extends InstanceUserActivity {
  userSummary: UserSummary | null
}
