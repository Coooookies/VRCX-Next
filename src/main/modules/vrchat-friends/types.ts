import type { BaseFriendInformation } from '@shared/definition/vrchat-friends'

export interface FriendInformationWithRawLocation extends BaseFriendInformation {
  currentLocationRaw: string
  travelingLocationRaw: string
}

export type FriendFetcherProcessHandler = (friends: FriendInformationWithRawLocation[]) => void
