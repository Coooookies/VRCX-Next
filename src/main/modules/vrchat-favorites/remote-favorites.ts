import type { FavoritedGroupContainer } from './types'
import type {
  FavoritedAvatarInfo,
  FavoritedFriendInfo,
  FavoritedWorldInfo,
  FavoriteGroupSummary
} from '@shared/definition/vrchat-favorites'

export class RemoteFavorites {
  private readonly groups = new Map<string, FavoritedGroupContainer>()
  private readonly worlds = new Map<string, FavoritedWorldInfo>()
  private readonly avatars = new Map<string, FavoritedAvatarInfo>()
  private readonly friends = new Map<string, FavoritedFriendInfo>()

  public syncInitialGroups(groups: FavoriteGroupSummary[], itemGroups: Map<string, string[]>) {
    for (const group of groups) {
      this.groups.set(group.favoriteGroupId, {
        summary: group,
        itemIds: itemGroups.get(group.favoriteGroupName) ?? []
      })
    }
  }

  public syncInitialWorlds(worlds: FavoritedWorldInfo[]) {
    for (const world of worlds) {
      this.worlds.set(world.worldId, world)
    }
  }

  public syncInitialAvatars(avatars: FavoritedAvatarInfo[]) {
    for (const avatar of avatars) {
      this.avatars.set(avatar.avatarId, avatar)
    }
  }

  public syncInitialFriends(friends: FavoritedFriendInfo[]) {
    for (const friend of friends) {
      this.friends.set(friend.friendUserId, friend)
    }
  }

  public clear() {
    this.groups.clear()
    this.worlds.clear()
    this.avatars.clear()
    this.friends.clear()
  }
}
