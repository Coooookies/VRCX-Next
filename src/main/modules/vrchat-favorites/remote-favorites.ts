import type {
  FavoritedAvatarInfo,
  FavoritedFriendInfo,
  FavoritedWorldInfo,
  FavoriteGroupSummary
} from '@shared/definition/vrchat-favorites'

export class RemoteFavorites {
  private readonly groups = new Map<string, FavoriteGroupSummary>()
  private readonly groupItems = new Map<string, string[]>()

  private readonly worlds = new Map<string, FavoritedWorldInfo>()
  private readonly avatars = new Map<string, FavoritedAvatarInfo>()
  private readonly friends = new Map<string, FavoritedFriendInfo>()

  public syncInitialGroups(groups: FavoriteGroupSummary[]) {
    for (const group of groups) {
      this.groups.set(group.favoriteGroupId, group)
    }
  }

  public syncInitialWorlds(worlds: FavoritedWorldInfo[], itemGroups: Map<string, string[]>) {
    for (const world of worlds) {
      this.worlds.set(world.worldId, world)
    }

    for (const [groupName, itemIds] of itemGroups) {
      this.groupItems.set(groupName, itemIds)
    }
  }

  public syncInitialAvatars(avatars: FavoritedAvatarInfo[], itemGroups: Map<string, string[]>) {
    for (const avatar of avatars) {
      this.avatars.set(avatar.avatarId, avatar)
    }

    for (const [groupName, itemIds] of itemGroups) {
      this.groupItems.set(groupName, itemIds)
    }
  }

  public syncInitialFriends(friends: FavoritedFriendInfo[], itemGroups: Map<string, string[]>) {
    for (const friend of friends) {
      this.friends.set(friend.friendUserId, friend)
    }

    for (const [groupName, itemIds] of itemGroups) {
      this.groupItems.set(groupName, itemIds)
    }
  }

  public clear() {
    this.groups.clear()
    this.worlds.clear()
    this.avatars.clear()
    this.friends.clear()
  }
}
