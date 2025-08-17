import type { UserStatus, Platform } from './vrchat-api-response'
import type { ReferenceAvatar } from './vrchat-avatars'
import type { LocationInstance } from './vrchat-instances'
import type { UserLanguage, UserTrustRank } from './vrchat-users'

export interface BaseFriendInformation {
  userId: string
  profileIconFileId: string
  profileIconFileVersion: number
  profileBackgroundFileId: string
  profileBackgroundFileVersion: number
  displayName: string
  status: UserStatus
  statusDescription: string
  referenceAvatar: ReferenceAvatar
  note?: string
  bio: string
  bioLinks: string[]
  tags: string[]
  platform: Platform
  trustRank: UserTrustRank
  languages: UserLanguage[]
  lastPlatform: string
  lastLoginDate: Date | null
  lastActivityDate: Date | null
  isSupporter: boolean
}

export interface FriendInformation extends BaseFriendInformation {
  location: LocationInstance | null
  locationArrivedAt: Date | null
  isTraveling: boolean
}
