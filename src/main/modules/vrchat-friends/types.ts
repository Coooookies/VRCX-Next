import type { BaseFriendInformation } from '@shared/definition/vrchat-friends'
import type { GroupSummary } from '@shared/definition/vrchat-groups'
import type { UserSummary } from '@shared/definition/vrchat-users'
import type {
  LocationInstanceGroupType,
  LocationInstancePublicType,
  LocationInstanceUserType
} from '@shared/definition/vrchat-instances'

export interface FriendInformationWithRawLocation extends BaseFriendInformation {
  currentLocationRaw: string
  travelingLocationRaw: string
}

export type FriendFetcherProcessHandler = (friends: FriendInformationWithRawLocation[]) => void

export interface FriendLocationActivityNormalReference {
  instanceType: LocationInstancePublicType
}

export interface FriendLocationActivityGroupReference {
  instanceType: LocationInstanceGroupType
  referenceGroup?: GroupSummary
}

export interface FriendLocationActivityFriendReference {
  instanceType: LocationInstanceUserType
  referenceUser?: UserSummary
}

export type FriendLocationActivityReference =
  | FriendLocationActivityNormalReference
  | FriendLocationActivityGroupReference
  | FriendLocationActivityFriendReference
