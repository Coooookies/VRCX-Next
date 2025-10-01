import type { BaseFriendInformation } from '@shared/definition/vrchat-friends'
import type { LocationInstanceOverview } from '@shared/definition/vrchat-instances'

export type LocationInstanceWithTracking = LocationInstanceOverview & {
  __trackSymbol__: symbol
}

export interface FriendInformationWithLocationTracking extends BaseFriendInformation {
  location: LocationInstanceWithTracking | null
}

export interface FriendInformationWithRawLocation extends BaseFriendInformation {
  currentLocationRaw: string
  travelingLocationRaw: string
}

export type FriendFetcherProcessHandler = (friends: FriendInformationWithRawLocation[]) => void
