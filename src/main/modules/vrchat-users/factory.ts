import { parseFileUrl, getProfileIconUrl } from '../vrchat-files/parser'
import { UserTrustRank, UserLanguage } from '@shared/definition/vrchat-users'
import type { UserAvatar } from '@shared/definition/vrchat-avatars'
import type { CurrentUser } from '@shared/definition/vrchat-api-response'
import type { UserInformation } from '@shared/definition/vrchat-users'

export function toCurrentUserInformation(user: CurrentUser): UserInformation {
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
    pronouns: user.pronouns,
    avatar,
    bio: user.bio || '',
    bioLinks: user.bioLinks || [],
    badges: badges || [],
    tags: user.tags,
    trustRank,
    platform: user.last_platform,
    languages,
    ageVerified: user.ageVerified,
    ageVerificationStatus: user.ageVerificationStatus,
    isSupporter: supporter
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
