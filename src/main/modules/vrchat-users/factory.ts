import { parseFileUrl, getProfileIconUrl } from '../vrchat-files/parser'
import { UserTrustRank, UserLanguage } from '@shared/definition/vrchat-users'
import { UserEntity } from '../database/entities/users'
import type { FriendInformation } from '@shared/definition/vrchat-friends'
import type { ReferenceAvatar, UserAvatar } from '@shared/definition/vrchat-avatars'
import type { CurrentUserInformation, UserInformation } from '@shared/definition/vrchat-users'
import type {
  CurrentUser,
  LimitedUserFriend,
  Platform,
  User
} from '@shared/definition/vrchat-api-response'

export function toCurrentUserInformation(user: CurrentUser): CurrentUserInformation {
  const profileIconUrl = getProfileIconUrl(user)
  const profileIconFileInfo = parseFileUrl(profileIconUrl)
  const profileBackgroundFileInfo = parseFileUrl(
    user.profilePicOverride || user.currentAvatarImageUrl
  )

  const languages = toUserLanguageTags(user.tags)
  const trustRank = toUserTrustRank(user.tags)
  const supporter = isSupporter(user.tags)
  const badges = user.badges?.map((badge) => ({
    badgeId: badge.badgeId,
    name: badge.badgeName,
    description: badge.badgeDescription,
    thumbnailUrl: badge.badgeImageUrl,
    showcased: badge.showcased,
    hidden: badge.hidden || false,
    updatedAt: new Date(badge.updatedAt || 0),
    assignedAt: new Date(badge.assignedAt || 0)
  }))

  const joinDate = user.date_joined ? new Date(user.date_joined) : null
  const avatarFileInfo = parseFileUrl(user.currentAvatarImageUrl)
  const avatarId = user.currentAvatar
  const avatar: UserAvatar = {
    avatarId,
    allowCopying: user.allowAvatarCopying,
    imageFileId: avatarFileInfo.fileId,
    imageFileVersion: avatarFileInfo.version
  }

  return {
    userId: user.id,
    displayName: user.displayName,
    developerType: user.developerType,
    status: user.status,
    statusDescription: user.statusDescription,
    statusHistory: user.statusHistory,
    profileIconFileId: profileIconFileInfo.fileId,
    profileIconFileVersion: profileIconFileInfo.version,
    profileBackgroundFileId: profileBackgroundFileInfo.fileId,
    profileBackgroundFileVersion: profileBackgroundFileInfo.version,
    allowAvatarCopying: user.allowAvatarCopying,
    pronouns: user.pronouns,
    avatar,
    bio: user.bio || '',
    bioLinks: user.bioLinks || [],
    badges: badges || [],
    tags: user.tags,
    trustRank,
    platform: user.last_platform as Platform,
    languages,
    ageVerified: user.ageVerified,
    ageVerificationStatus: user.ageVerificationStatus,
    joinDate,
    isSupporter: supporter
  }
}

export function toUserInformation(user: User): UserInformation {
  const profileIconUrl = getProfileIconUrl(user)
  const profileIconFileInfo = parseFileUrl(profileIconUrl)
  const profileBackgroundFileInfo = parseFileUrl(
    user.profilePicOverride || user.currentAvatarImageUrl
  )

  const languages = toUserLanguageTags(user.tags)
  const trustRank = toUserTrustRank(user.tags)
  const supporter = isSupporter(user.tags)
  const badges = user.badges?.map((badge) => ({
    badgeId: badge.badgeId,
    name: badge.badgeName,
    description: badge.badgeDescription,
    thumbnailUrl: badge.badgeImageUrl,
    showcased: badge.showcased,
    hidden: badge.hidden || false,
    updatedAt: new Date(badge.updatedAt || 0),
    assignedAt: new Date(badge.assignedAt || 0)
  }))

  const joinDate = user.date_joined ? new Date(user.date_joined) : null
  const avatarFileInfo = parseFileUrl(user.currentAvatarImageUrl)
  const referenceAvatar: ReferenceAvatar = {
    imageFileId: avatarFileInfo.fileId,
    imageFileVersion: avatarFileInfo.version
  }

  return {
    userId: user.id,
    displayName: user.displayName,
    developerType: user.developerType,
    status: user.status,
    statusDescription: user.statusDescription,
    profileIconFileId: profileIconFileInfo.fileId,
    profileIconFileVersion: profileIconFileInfo.version,
    profileBackgroundFileId: profileBackgroundFileInfo.fileId,
    profileBackgroundFileVersion: profileBackgroundFileInfo.version,
    allowAvatarCopying: user.allowAvatarCopying,
    pronouns: user.pronouns,
    referenceAvatar,
    bio: user.bio || '',
    bioLinks: user.bioLinks || [],
    badges: badges || [],
    tags: user.tags,
    trustRank,
    platform: user.last_platform as Platform,
    languages,
    ageVerified: user.ageVerified,
    ageVerificationStatus: user.ageVerificationStatus,
    joinDate,
    isSupporter: supporter,
    isFriend: user.isFriend
  }
}

export function toUserEntity(user: User | CurrentUser | LimitedUserFriend): UserEntity {
  const profileIconUrl = getProfileIconUrl(user)
  const profileIconFileInfo = parseFileUrl(profileIconUrl)
  const languages = toUserLanguageTags(user.tags)
  const trustRank = toUserTrustRank(user.tags)
  const supporter = isSupporter(user.tags)

  return {
    userId: user.id,
    displayName: user.displayName,
    profileIconFileId: profileIconFileInfo.fileId,
    profileIconFileVersion: profileIconFileInfo.version,
    trustRank,
    languages,
    isSupporter: supporter,
    cacheUpdatedAt: new Date()
  }
}

export function toFriendUserEntity(friend: FriendInformation): UserEntity {
  return {
    userId: friend.userId,
    displayName: friend.displayName,
    profileIconFileId: friend.profileIconFileId,
    profileIconFileVersion: friend.profileIconFileVersion,
    trustRank: friend.trustRank,
    languages: friend.languages,
    isSupporter: friend.isSupporter,
    cacheUpdatedAt: new Date()
  }
}

export function toUserLanguageTags(tags: string[]): UserLanguage[] {
  const languages = Object.values(UserLanguage)
  return tags.filter((tag) => languages.includes(tag as UserLanguage)) as UserLanguage[]
}

export function toUserTrustRank(tags: string[]): UserTrustRank {
  if (tags.includes(UserTrustRank.Moderator)) return UserTrustRank.Moderator
  if (tags.includes(UserTrustRank.Trusted)) return UserTrustRank.Trusted
  if (tags.includes(UserTrustRank.Known)) return UserTrustRank.Known
  if (tags.includes(UserTrustRank.User)) return UserTrustRank.User
  if (tags.includes(UserTrustRank.New)) return UserTrustRank.New
  if (tags.includes(UserTrustRank.Troll)) return UserTrustRank.Troll
  return UserTrustRank.Visitor
}

export function isSupporter(tags: string[]): boolean {
  return tags.includes('system_supporter')
}
