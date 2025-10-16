import { FavoriteGroupVisibility, FavoriteType } from './vrchat-api-response'
import type { AvatarSummary } from './vrchat-avatars'
import type { WorldSummary } from './vrchat-worlds'

export type FavoritedWorldInfo =
  | {
      isAvailable: true
      favoriteId: string
      worldId: string
      referenceWorld: WorldSummary
    }
  | {
      isAvailable: false
      favoriteId: string
      worldId: string
      referenceWorld: null
    }

export type FavoritedAvatarInfo =
  | {
      isAvailable: true
      favoriteId: string
      avatarId: string
      referenceAvatar: AvatarSummary
    }
  | {
      isAvailable: false
      favoriteId: string
      avatarId: string
      referenceAvatar: null
    }

export type FavoritedFriendInfo = {
  favoriteId: string
  friendUserId: string
  friendUserName: string
}

export interface FavoriteGroupSummary {
  displayName: string
  favoriteGroupId: string
  favoriteGroupName: string
  ownerUserId: string
  tags: string[]
  type: FavoriteType
  visibility: FavoriteGroupVisibility
}
