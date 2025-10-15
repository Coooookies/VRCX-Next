import {
  FAVORITE_AVATARS_QUERY_SIZE,
  FAVORITE_FRIENDS_QUERY_SIZE,
  FAVORITE_GROUPS_QUERY_SIZE,
  FAVORITE_WORLDS_QUERY_SIZE
} from './constants'
import type { LoggerFactory } from '@main/logger'
import type { VRChatAPI } from '../vrchat-api'
import type {
  Avatar,
  Favorite,
  FavoritedWorld,
  FavoriteGroup,
  FavoriteType
} from '@shared/definition/vrchat-api-response'

export class FavoriteFetcher {
  constructor(
    private readonly logger: LoggerFactory,
    private readonly api: VRChatAPI
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
}
