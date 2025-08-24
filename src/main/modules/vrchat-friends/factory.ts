import { isGroupInstance } from '../vrchat-worlds/factory'
import { isSupporter, toUserLanguageTags, toUserTrustRank } from '../vrchat-users/factory'
import { parseFileUrl, getProfileIconUrl } from '../vrchat-files/parser'
import { parseLocation } from '../vrchat-worlds/location-parser'
import { Platform } from '@shared/definition/vrchat-api-response'
import type { ReferenceAvatar } from '@shared/definition/vrchat-avatars'
import type { BaseFriendInformation } from '@shared/definition/vrchat-friends'
import type { LocationInstanceGroup } from '@shared/definition/vrchat-instances'
import type { User, CurrentUser, LimitedUserFriend } from '@shared/definition/vrchat-api-response'

export function toBaseFriendInformation(
  friend: User | CurrentUser | LimitedUserFriend
): BaseFriendInformation {
  const platform = ('platform' in friend && (friend.platform as Platform)) || Platform.Unknown
  const profileIconUrl = getProfileIconUrl(friend)
  const profileIconFileInfo = parseFileUrl(profileIconUrl)
  const profileBackgroundFileInfo = parseFileUrl(
    friend.profilePicOverride || friend.currentAvatarImageUrl
  )

  const avatarFileInfo = parseFileUrl(friend.currentAvatarImageUrl)
  const languages = toUserLanguageTags(friend.tags)
  const trustRank = toUserTrustRank(friend.tags)
  const supporter = isSupporter(friend.tags)
  const referenceAvatar: ReferenceAvatar = {
    imageFileId: avatarFileInfo.fileId,
    imageFileVersion: avatarFileInfo.version,
    allowCopying: 'allowAvatarCopying' in friend ? friend.allowAvatarCopying : false
  }

  return {
    userId: friend.id,
    displayName: friend.displayName,
    status: friend.status,
    statusDescription: friend.statusDescription,
    profileIconFileId: profileIconFileInfo.fileId,
    profileIconFileVersion: profileIconFileInfo.version,
    profileBackgroundFileId: profileBackgroundFileInfo.fileId,
    profileBackgroundFileVersion: profileBackgroundFileInfo.version,
    referenceAvatar,
    note: 'note' in friend ? friend.note || null : null,
    bio: friend.bio || '',
    bioLinks: friend.bioLinks || [],
    tags: friend.tags,
    trustRank,
    platform,
    languages,
    lastPlatform: friend.last_platform,
    lastLoginDate: friend.last_login ? new Date(friend.last_login) : null,
    lastActivityDate: friend.last_activity ? new Date(friend.last_activity) : null,
    isSupporter: supporter
  }
}

export function toFriendInstanceDependency(friends: LimitedUserFriend[]) {
  const locations = friends
    .map((friend) => parseLocation(friend.location))
    .filter((location) => location !== null)

  const worldIds = locations.map((location) => location.worldId)
  const groupIds = locations
    .filter((location) => isGroupInstance(location))
    .map((location) => location as LocationInstanceGroup)
    .map((location) => location.groupId)

  return {
    worldIds: [...new Set(worldIds)],
    groupIds: [...new Set(groupIds)]
  }
}
