import { CurrentUserInformation } from '@shared/definition/vrchat-users'

export const SAVED_USER_ENTITY_EXPIRE_DELAY = 1000 * 60 * 60 * 24 * 3 // 3 days
export const USERNOTES_QUERY_SIZE = 100
export const USER_ENTITIES_QUERY_THREAD_SIZE = 10
export const USER_UPDATE_COMPARE_KEYS: (keyof CurrentUserInformation)[] = [
  'profileIconFileId',
  'profileIconFileVersion',
  'profileBackgroundFileId',
  'profileBackgroundFileVersion',
  'displayName',
  'developerType',
  'status',
  'statusDescription',
  'avatar',
  'ageVerified',
  'ageVerificationStatus',
  'statusHistory',
  'bio',
  'bioLinks',
  'tags',
  'platform',
  'pronouns',
  'trustRank',
  'languages',
  'isSupporter'
]
