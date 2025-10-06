import type { BaseFriendInformation } from '@shared/definition/vrchat-friends'

export interface FriendInformationWithRawLocation extends BaseFriendInformation {
  currentLocationRaw: string
  travelingLocationRaw: string
}

export type FriendFetcherProcessHandler = (friends: FriendInformationWithRawLocation[]) => void

export const FriendActivities = {
  DisplayName: 'displayName',
  Status: 'status',
  StatusDescription: 'statusDescription',
  Bio: 'bio',
  TrustRank: 'trustRank',
  IsSupporter: 'isSupporter',
  ReferenceAvatar: 'referenceAvatar'
} as const

export type FriendActivities = (typeof FriendActivities)[keyof typeof FriendActivities]
