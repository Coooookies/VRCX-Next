import { WorldFetcher } from './fetcher'
import { WorldRepository } from './repository'
import { Dependency, Module } from '@shared/module-constructor'
import { createLogger } from '@main/logger'
import type { VRChatAPI } from '../vrchat-api'
import type { VRChatPipeline } from '../vrchat-pipeline'
import type { VRChatAuthentication } from '../vrchat-authentication'
import type { Database } from '../database'

export class VRChatWorlds extends Module<{}> {
  @Dependency('VRChatAPI') declare private api: VRChatAPI
  @Dependency('VRChatPipeline') declare private pipeline: VRChatPipeline
  @Dependency('VRChatAuthentication') declare private auth: VRChatAuthentication
  @Dependency('Database') declare private database: Database

  private readonly logger = createLogger(this.moduleId)
  private repository!: WorldRepository
  private fetcher!: WorldFetcher

  protected onInit(): void {
    this.repository = new WorldRepository(this.database)
    this.fetcher = new WorldFetcher(this.repository, this.api)
  }
}
