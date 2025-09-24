import type { BaseFriendInformation } from '@shared/definition/vrchat-friends'

export const ONLINE_FRIENDS_QUERY_SIZE = 50
export const OFFLINE_FRIENDS_QUERY_SIZE = 100
export const FRIEND_UPDATE_COMPARE_KEYS: (keyof BaseFriendInformation)[] = [
  'profileIconFileId',
  'profileIconFileVersion',
  'profileBackgroundFileId',
  'profileBackgroundFileVersion',
  'displayName',
  'status',
  'statusDescription',
  'bio',
  'bioLinks',
  'tags',
  'platform',
  'trustRank',
  'languages',
  'isSupporter',
  'referenceAvatar',
  'lastPlatform',
  'lastLoginDate',
  'lastActivityDate'
]
