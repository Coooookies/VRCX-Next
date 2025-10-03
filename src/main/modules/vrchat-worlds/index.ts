import { WorldFetcher } from './fetcher'
import { WorldEventBinding } from './event-binding'
import { WorldRepository } from './repository'
import { Dependency, Module } from '@shared/module-constructor'
import { createLogger } from '@main/logger'
import type { VRChatAPI } from '../vrchat-api'
import type { VRChatPipeline } from '../vrchat-pipeline'
import type { VRChatAuthentication } from '../vrchat-authentication'
import type { VRChatGroups } from '../vrchat-groups'
import type { VRChatFiles } from '../vrchat-files'
import type { Database } from '../database'

export class VRChatWorlds extends Module {
  @Dependency('VRChatAPI') declare private api: VRChatAPI
  @Dependency('VRChatPipeline') declare private pipeline: VRChatPipeline
  @Dependency('VRChatAuthentication') declare private auth: VRChatAuthentication
  @Dependency('VRChatGroups') declare private groups: VRChatGroups
  @Dependency('VRChatFiles') declare private files: VRChatFiles
  @Dependency('Database') declare private database: Database

  private readonly logger = createLogger(this.moduleId)
  private repository!: WorldRepository
  private eventBinding!: WorldEventBinding
  private fetcher!: WorldFetcher

  protected onInit(): void {
    this.repository = new WorldRepository(this.database)
    this.fetcher = new WorldFetcher(this.logger, this.repository, this.api, this.groups, this.files)
    this.eventBinding = new WorldEventBinding(this.logger, this.pipeline, this.repository)

    // unused protect
    void this.eventBinding
  }

  public fetchWorldSummaries(...args: Parameters<WorldFetcher['fetchWorldSummaries']>) {
    return this.fetcher.fetchWorldSummaries(...args)
  }

  public fetchWorldSummary(...args: Parameters<WorldFetcher['fetchWorldSummary']>) {
    return this.fetcher.fetchWorldSummary(...args)
  }

  public fetchWorld(...args: Parameters<WorldFetcher['fetchWorld']>) {
    return this.fetcher.fetchWorld(...args)
  }
}
