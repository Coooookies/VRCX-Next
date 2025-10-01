import { parseLocation } from '../vrchat-worlds/location-parser'
import { isGroupInstance } from '../vrchat-worlds/utils'

import {
  getProfileBackgroundUrl,
  getProfileIconUrl,
  isSupporter,
  toUserLanguageTags,
  toUserPlatformState,
  toUserTrustRank
} from '../vrchat-users/factory'
import { parseFileUrl } from '../vrchat-files/factory'
import { Platform } from '@shared/definition/vrchat-api-response'
import {
  InstanceAccessCategory,
  LocationInstanceGroupType,
  LocationInstancePublicType,
  LocationInstanceUserType
} from '@shared/definition/vrchat-instances'
import type {
  LocationInstance,
  LocationInstanceOverview
} from '@shared/definition/vrchat-instances'
import type { FriendInformationWithLocationTracking, LocationInstanceWithTracking } from './types'
import type { BaseFriendInformation, FriendInformation } from '@shared/definition/vrchat-friends'
import type { LimitedUserFriend, User } from '@shared/definition/vrchat-api-response'
import type { ReferenceAvatar } from '@shared/definition/vrchat-avatars'

export function getLocationInstanceCategory(location: LocationInstance): InstanceAccessCategory {
  switch (location.type) {
    case LocationInstancePublicType.Public: {
      return InstanceAccessCategory.Public
    }
    case LocationInstanceUserType.Friends:
    case LocationInstanceUserType.FriendsPlus:
    case LocationInstanceUserType.Invite:
    case LocationInstanceUserType.InvitePlus: {
      return InstanceAccessCategory.User
    }
    case LocationInstanceGroupType.Group:
    case LocationInstanceGroupType.GroupPlus:
    case LocationInstanceGroupType.GroupPublic: {
      return InstanceAccessCategory.Group
    }
  }
}

export function getLocationInstanceDependency(location: LocationInstance | LocationInstance[]) {
  const locations = Array.isArray(location) ? location : [location]
  const worldIds = locations.map((location) => location.worldId)
  const groupIds = locations
    .filter((location) => isGroupInstance(location))
    .map((location) => location.groupId)

  return {
    worldIds: [...new Set(worldIds)],
    groupIds: [...new Set(groupIds)]
  }
}

export function generateLocationTarget(
  currentLocationRaw: string,
  travelingLocationRaw: string
): LocationInstanceWithTracking | null {
  const currentLocationTarget = parseLocation(currentLocationRaw)
  const travelingLocationTarget = parseLocation(travelingLocationRaw)

  const trackSymbol = Symbol()
  const isTraveling =
    currentLocationRaw === 'traveling' || currentLocationRaw.startsWith('traveling:')

  const nextLocationTarget = isTraveling ? travelingLocationTarget : currentLocationTarget
  return nextLocationTarget
    ? {
        instance: nextLocationTarget,
        category: getLocationInstanceCategory(nextLocationTarget),
        isTraveling,
        arrivedAt: new Date(),
        __trackSymbol__: trackSymbol
      }
    : null
}

export function toBaseFriendInformation(friend: User | LimitedUserFriend): BaseFriendInformation {
  const platform = friend.platform as Platform
  const profileIconUrl = getProfileIconUrl(friend)
  const profileBackgroundUrl = getProfileBackgroundUrl(friend)
  const profileIconFileInfo = parseFileUrl(profileIconUrl)
  const profileBackgroundFileInfo = parseFileUrl(profileBackgroundUrl)

  const avatarFileInfo = parseFileUrl(friend.currentAvatarImageUrl)
  const languages = toUserLanguageTags(friend.tags)
  const trustRank = toUserTrustRank(friend.tags)
  const state = 'state' in friend ? friend.state : toUserPlatformState(platform)
  const supporter = isSupporter(friend.tags)
  const referenceAvatar: ReferenceAvatar = {
    imageFileId: avatarFileInfo?.fileId || '',
    imageFileVersion: avatarFileInfo?.version || 0
  }

  return {
    userId: friend.id,
    displayName: friend.displayName,
    state,
    status: friend.status,
    statusDescription: friend.statusDescription,
    profileIconFileId: profileIconFileInfo?.fileId || '',
    profileIconFileVersion: profileIconFileInfo?.version || 0,
    profileBackgroundFileId: profileBackgroundFileInfo?.fileId || '',
    profileBackgroundFileVersion: profileBackgroundFileInfo?.version || 0,
    referenceAvatar,
    bio: friend.bio || '',
    bioLinks: friend.bioLinks || [],
    tags: friend.tags,
    trustRank,
    platform: friend.platform as Platform,
    order: 0,
    languages,
    lastPlatform: friend.last_platform,
    lastLoginDate: friend.last_login ? new Date(friend.last_login) : null,
    lastActivityDate: friend.last_activity ? new Date(friend.last_activity) : null,
    isSupporter: supporter
  }
}

export function toFriendInformationFromTracking(
  friend: FriendInformationWithLocationTracking
): FriendInformation {
  const { location, ...rest } = friend

  return {
    ...rest,
    location: location ? toLocationInstanceOverviewFromTracking(location) : null
  }
}

export function toLocationInstanceOverviewFromTracking(
  location: LocationInstanceWithTracking
): LocationInstanceOverview {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __trackSymbol__, ...locationRest } = location
  return {
    ...locationRest
  }
}
