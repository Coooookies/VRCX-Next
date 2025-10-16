import { Dependency, Module } from '@shared/module-constructor'
import { createLogger } from '@main/logger'
import { RemoteFavorites } from './remote-favorites'
import { FavoriteFetcher } from './fetcher'
import { FavoriteCoordinator } from './coordinator'
import type { IPCModule } from '../ipc'
import type { MobxState } from '../mobx-state'
import type { Database } from '../database'
import type { VRChatAPI } from '../vrchat-api'
import type { VRChatFriends } from '../vrchat-friends'

export class VRChatFavorites extends Module {
  @Dependency('IPCModule') declare private ipc: IPCModule
  @Dependency('MobxState') declare private mobx: MobxState
  @Dependency('Database') declare private database: Database
  @Dependency('VRChatAPI') declare private api: VRChatAPI
  @Dependency('VRChatFriends') declare private friends: VRChatFriends

  private logger = createLogger('VRChatFavorites')
  private fetcher!: FavoriteFetcher
  private coordinator!: FavoriteCoordinator
  private remoteFavorites!: RemoteFavorites

  protected onInit(): void {
    this.remoteFavorites = new RemoteFavorites()
    this.fetcher = new FavoriteFetcher(this.logger, this.api, this.friends)
    this.coordinator = new FavoriteCoordinator(this.fetcher, this.remoteFavorites)

    void this.coordinator
  }
}
