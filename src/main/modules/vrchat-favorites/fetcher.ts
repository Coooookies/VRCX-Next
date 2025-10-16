import { toWorldEntity } from '../vrchat-worlds/factory'
import { toAvatarEntity } from '../vrchat-avatars/factory'
import {
  FAVORITE_AVATARS_QUERY_SIZE,
  FAVORITE_FRIENDS_QUERY_SIZE,
  FAVORITE_GROUPS_QUERY_SIZE,
  FAVORITE_WORLDS_QUERY_SIZE
} from './constants'
import { FavoriteType, ReleaseStatus } from '@shared/definition/vrchat-api-response'
import type { LoggerFactory } from '@main/logger'
import type { VRChatAPI } from '../vrchat-api'
import type { VRChatFriends } from '../vrchat-friends'
import type { FavoritedContainer } from './types'
import type {
  Avatar,
  Favorite,
  FavoritedWorld,
  FavoriteGroup
} from '@shared/definition/vrchat-api-response'
import type {
  FavoritedAvatarInfo,
  FavoritedFriendInfo,
  FavoritedWorldInfo,
  FavoriteGroupSummary
} from '@shared/definition/vrchat-favorites'

export class FavoriteFetcher {
  constructor(
    private readonly logger: LoggerFactory,
    private readonly api: VRChatAPI,
    private readonly friends: VRChatFriends
  ) {}

  public async fetchFavoriteItems(type?: FavoriteType, tag?: string): Promise<Favorite[]> {
    const items: Favorite[] = []
    let startOffset = 0

    while (true) {
      const result = await this.api.ref.sessionAPI.favorites.getFavorites(
        startOffset,
        FAVORITE_FRIENDS_QUERY_SIZE,
        {
          type,
          tag
        }
      )

      if (!result.success) {
        this.logger.error(`Failed to fetch favorite items, error: ${result.error.message}`)
        break
      }

      if (result.value.body.length === 0) {
        break
      }

      items.push(...result.value.body)
      startOffset += result.value.body.length

      if (result.value.body.length < FAVORITE_FRIENDS_QUERY_SIZE) {
        break
      }
    }

    return items
  }

  public async fetchFavoriteItemGroups(): Promise<FavoriteGroup[]> {
    const groups: FavoriteGroup[] = []
    let startOffset = 0

    while (true) {
      const result = await this.api.ref.sessionAPI.favorites.getFavoriteGroups(
        startOffset,
        FAVORITE_GROUPS_QUERY_SIZE
      )

      if (!result.success) {
        this.logger.error(`Failed to fetch favorite groups, error: ${result.error.message}`)
        break
      }

      if (result.value.body.length === 0) {
        break
      }

      groups.push(...result.value.body)
      startOffset += result.value.body.length

      if (result.value.body.length < FAVORITE_GROUPS_QUERY_SIZE) {
        break
      }
    }

    return groups
  }

  public async fetchFavoriteWorlds(): Promise<FavoritedWorld[]> {
    const worlds: FavoritedWorld[] = []
    let startOffset = 0

    while (true) {
      const result = await this.api.ref.sessionAPI.worlds.getFavoriteWorlds(
        startOffset,
        FAVORITE_WORLDS_QUERY_SIZE
      )

      if (!result.success) {
        this.logger.warn(`Failed to fetch favorite worlds, error: ${result.error.message}`)
        break
      }

      if (result.value.body.length === 0) {
        break
      }

      worlds.push(...result.value.body)
      startOffset += result.value.body.length

      if (result.value.body.length < FAVORITE_WORLDS_QUERY_SIZE) {
        break
      }
    }

    return worlds
  }

  public async fetchFavoriteAvatars(): Promise<Avatar[]> {
    const avatars: Avatar[] = []
    let startOffset = 0

    while (true) {
      const result = await this.api.ref.sessionAPI.avatars.getFavoriteAvatars(
        startOffset,
        FAVORITE_AVATARS_QUERY_SIZE
      )

      if (!result.success) {
        this.logger.warn('Failed to fetch favorite avatars')
        break
      }

      if (result.value.body.length === 0) {
        break
      }

      avatars.push(...result.value.body)
      startOffset += result.value.body.length

      if (result.value.body.length < FAVORITE_AVATARS_QUERY_SIZE) {
        break
      }
    }

    return avatars
  }

  public async getFavoriteGroups(): Promise<FavoriteGroupSummary[]> {
    const groups = await this.fetchFavoriteItemGroups()
    return groups.map((g) => ({
      displayName: g.displayName,
      favoriteGroupId: g.id,
      favoriteGroupName: g.name,
      ownerUserId: g.ownerId,
      tags: g.tags,
      type: g.type,
      visibility: g.visibility
    }))
  }

  public async getFavoriteFriends(): Promise<FavoritedContainer<FavoritedFriendInfo>> {
    const items = await this.fetchFavoriteItems(FavoriteType.Friend)
    const groups = new Map<string, string[]>()
    const friends: FavoritedFriendInfo[] = []

    for (const item of items) {
      const friendUserSummary = this.friends.getFriendSession(item.favoriteId)
      const groupName = item.tags?.[0] || '__uncategorized__'

      if (!groups.has(groupName)) {
        groups.set(groupName, [])
      }

      groups.get(groupName)?.push(item.favoriteId)
      friends.push({
        favoriteId: item.id,
        friendUserId: item.favoriteId,
        friendUserName: friendUserSummary?.displayName || item.favoriteId
      })
    }

    return {
      items: friends,
      groups
    }
  }

  public async getFavoriteWorlds(): Promise<FavoritedContainer<FavoritedWorldInfo>> {
    const items = await this.fetchFavoriteWorlds()
    const groups = new Map<string, string[]>()
    const worlds: FavoritedWorldInfo[] = []

    for (const item of items) {
      const worldId = item.favoriteId
      const worldSummary = toWorldEntity(item)
      const groupName = item.favoriteGroup || '__uncategorized__'

      // world might be deleted
      const isAvailable = worldSummary.releaseStatus !== ReleaseStatus.Hidden
      const worldResult: FavoritedWorldInfo = isAvailable
        ? {
            isAvailable: true,
            favoriteId: item.id,
            worldId,
            referenceWorld: worldSummary
          }
        : {
            isAvailable: false,
            favoriteId: item.id,
            worldId,
            referenceWorld: null
          }

      if (!groups.has(groupName)) {
        groups.set(groupName, [])
      }

      groups.get(groupName)?.push(worldSummary.worldId)
      worlds.push(worldResult)
    }

    return {
      items: worlds,
      groups
    }
  }

  public async getFavoriteAvatars(): Promise<FavoritedContainer<FavoritedAvatarInfo>> {
    const avatarItems = await this.fetchFavoriteAvatars()
    const groupItems = await this.fetchFavoriteItems(FavoriteType.Avatar)
    const groups = new Map<string, string[]>()
    const avatars: FavoritedAvatarInfo[] = []

    for (const groupItem of groupItems) {
      const avatarId = groupItem.favoriteId
      const avatarSummary = avatarItems.find((a) => a.id === avatarId)
      const groupName = groupItem.tags?.[0] || '__uncategorized__'

      // avatar might be deleted
      const isAvailable = !!avatarSummary && avatarSummary.releaseStatus !== ReleaseStatus.Hidden
      const avatarResult: FavoritedAvatarInfo = isAvailable
        ? {
            isAvailable: true,
            favoriteId: groupItem.id,
            avatarId,
            referenceAvatar: toAvatarEntity(avatarSummary)
          }
        : {
            isAvailable: false,
            favoriteId: groupItem.id,
            avatarId,
            referenceAvatar: null
          }

      if (!groups.has(groupName)) {
        groups.set(groupName, [])
      }

      groups.get(groupName)?.push(avatarId)
      avatars.push(avatarResult)
    }

    return {
      items: avatars,
      groups
    }
  }
}
