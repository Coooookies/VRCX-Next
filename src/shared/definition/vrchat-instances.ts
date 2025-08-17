import type { Region } from './vrchat-api-response'

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
  worldId: string
  worldName: string
  worldImageFileId: string
  worldImageFileVersion: number
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
  groupName: string
  groupImageFileId: string
  groupImageFileVersion: number
  require18yo: boolean
}

export type LocationInstance = LocationInstancePublic | LocationInstanceUser | LocationInstanceGroup
