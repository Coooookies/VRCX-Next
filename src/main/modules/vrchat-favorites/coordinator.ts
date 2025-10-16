import { mergeArrayMaps } from '@shared/utils/array'
import type { FavoriteFetcher } from './fetcher'
import type { RemoteFavorites } from './remote-favorites'

export class FavoriteCoordinator {
  constructor(
    private readonly fetcher: FavoriteFetcher,
    private readonly remote: RemoteFavorites
  ) {}

  public async initialize() {
    const groups = await this.fetcher.getFavoriteGroups()
    const [worlds, avatars, friends] = await Promise.all([
      this.fetcher.getFavoriteWorlds(),
      this.fetcher.getFavoriteAvatars(),
      this.fetcher.getFavoriteFriends()
    ])

    const itemGroups = mergeArrayMaps(worlds.groups, avatars.groups, friends.groups)
    this.remote.syncInitialGroups(groups, itemGroups)
    this.remote.syncInitialWorlds(worlds.items)
    this.remote.syncInitialAvatars(avatars.items)
    this.remote.syncInitialFriends(friends.items)
  }

  public async clear() {
    this.remote.clear()
  }
}
