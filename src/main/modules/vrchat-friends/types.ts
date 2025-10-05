import type { BaseFriendInformation } from '@shared/definition/vrchat-friends'
import type { LocationInstanceOverview } from '@shared/definition/vrchat-instances'

export type LocationInstanceWithTracking = LocationInstanceOverview & {
  __locationTrackSymbol__: symbol
}

export interface FriendInformationWithTracking extends BaseFriendInformation {
  location: LocationInstanceWithTracking | null
  __stateTrackSymbol__?: symbol
}

export interface FriendInformationWithRawLocation extends BaseFriendInformation {
  currentLocationRaw: string
  travelingLocationRaw: string
}

export type FriendFetcherProcessHandler = (friends: FriendInformationWithRawLocation[]) => void
