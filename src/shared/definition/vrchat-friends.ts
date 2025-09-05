import type { ReferenceAvatar } from './vrchat-avatars'
import type { LocationInstanceSummary } from './vrchat-instances'
import type { UserInformationBase } from './vrchat-users'

export interface BaseFriendInformation extends UserInformationBase {
  referenceAvatar: ReferenceAvatar
  note: string | null
  lastPlatform: string
  lastLoginDate: Date | null
  lastActivityDate: Date | null
}

export interface FriendInformation extends BaseFriendInformation {
  location: LocationInstanceSummary | null
  locationArrivedAt: Date | null
  isTraveling: boolean
}
