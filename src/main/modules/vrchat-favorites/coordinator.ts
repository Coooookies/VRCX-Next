import type { LoggerFactory } from '@main/logger'
import type { FavoriteFetcher } from './fetcher'
import type { RemoteFavorites } from './remote-favorites'

export class FavoriteCoordinator {
  constructor(
    private readonly logger: LoggerFactory,
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

    this.remote.syncInitialGroups(groups)
    this.remote.syncInitialWorlds(worlds.items, worlds.groups)
    this.remote.syncInitialAvatars(avatars.items, avatars.groups)
    this.remote.syncInitialFriends(friends.items, friends.groups)

    this.logger.info(
      'Fetched favorite groups and items.',
      `Groups: ${groups.length}`,
      `Worlds: ${worlds.items.length}`,
      `Avatars: ${avatars.items.length}`,
      `Friends: ${friends.items.length}`
    )
  }

  public uninitialize() {
    this.remote.clear()
  }

  public async clear() {
    this.remote.clear()
  }
}
