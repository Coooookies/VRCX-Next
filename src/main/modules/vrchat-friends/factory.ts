import { parseLocation } from '../vrchat-worlds/location-parser'
import { isGroupInstance, isUserInstance } from '../vrchat-instances/utils'

import {
  getProfileBackgroundUrl,
  getProfileIconUrl,
  isSupporter,
  toFriendUserEntity,
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
import { FriendActivityEvents } from '@shared/definition/vrchat-friends'
import type {
  LocationInstance,
  LocationInstanceOverview
} from '@shared/definition/vrchat-instances'
import type {
  BaseFriendInformation,
  FriendActivity,
  FriendInformation
} from '@shared/definition/vrchat-friends'
import type { LimitedUserFriend, User } from '@shared/definition/vrchat-api-response'
import type { ReferenceAvatar } from '@shared/definition/vrchat-avatars'
import { FriendLocationActivityReference } from './types'

export function getLocationInstanceCategory(location: LocationInstance): InstanceAccessCategory {
  switch (location.type) {
    case LocationInstancePublicType.Public: {
      return InstanceAccessCategory.Public
    }
    case LocationInstanceUserType.Friends:
    case LocationInstanceUserType.FriendsPlus:
    case LocationInstanceUserType.Invite:
    case LocationInstanceUserType.InvitePlus: {
      return InstanceAccessCategory.Friend
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
  const userIds = locations
    .filter((location) => isUserInstance(location))
    .map((location) => location.userId)

  return {
    worldIds: [...new Set(worldIds)],
    groupIds: [...new Set(groupIds)],
    userIds: [...new Set(userIds)]
  }
}

export function toLocation(
  currentLocationRaw: string,
  travelingLocationRaw: string
): LocationInstanceOverview | null {
  const currentLocationTarget = parseLocation(currentLocationRaw)
  const travelingLocationTarget = parseLocation(travelingLocationRaw)
  const isTraveling =
    currentLocationRaw === 'traveling' || currentLocationRaw.startsWith('traveling:')

  const nextLocationTarget = isTraveling ? travelingLocationTarget : currentLocationTarget
  return (
    nextLocationTarget
      ? {
          instance: nextLocationTarget,
          category: getLocationInstanceCategory(nextLocationTarget),
          isTraveling,
          arrivedAt: new Date()
        }
      : null
  ) as LocationInstanceOverview | null
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

export function toFriendLocationActivity(
  activityId: string,
  userId: string,
  user: FriendInformation,
  location: LocationInstanceOverview | null
): FriendActivity {
  const activityType = FriendActivityEvents.LocationChange
  const friendUserId = userId
  const friendUser = toFriendUserEntity(user)
  const recordedAt = new Date()
  const baseActivity = {
    activityId,
    activityType,
    friendUserId,
    friendUser,
    recordedAt
  }

  if (!location) {
    return {
      ...baseActivity,
      overview: null
    }
  }

  const world = location.referenceWorld
  const worldId = location.instance.worldId
  const worldName = location.referenceWorld?.worldName
  const worldVersion = location.referenceWorld?.version

  const [, instanceId] = location.instance.location.split(':')
  const instanceType = location.instance.type

  let ownerId: string | undefined
  let ownerName: string | undefined
  let reference: FriendLocationActivityReference

  switch (location.category) {
    case InstanceAccessCategory.Friend: {
      ownerId = location.instance.userId
      ownerName = location.referenceUser?.displayName
      reference = {
        instanceType: instanceType,
        referenceUser: location.referenceUser
      }
      break
    }
    case InstanceAccessCategory.Group: {
      ownerId = location.instance.groupId
      ownerName = location.referenceGroup?.groupName
      reference = {
        instanceType: instanceType,
        referenceGroup: location.referenceGroup
      }
      break
    }
    default: {
      reference = {
        instanceType: instanceType
      }
    }
  }

  return {
    ...baseActivity,
    overview: {
      worldId,
      worldName,
      worldVersion,
      ownerId,
      ownerName,
      instanceId,
      referenceWorld: world,
      ...reference
    }
  }
}

export function toFriendAvatarActivity() {
  
}