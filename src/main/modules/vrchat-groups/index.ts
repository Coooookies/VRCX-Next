import { GroupFetcher } from './fetcher'
import { GroupRepository } from './repository'
import { Dependency, Module } from '@shared/module-constructor'
import { createLogger } from '@main/logger'
import type { VRChatAPI } from '../vrchat-api'
import type { VRChatPipeline } from '../vrchat-pipeline'
import type { VRChatAuthentication } from '../vrchat-authentication'
import type { Database } from '../database'

export class VRChatGroups extends Module {
  @Dependency('VRChatAPI') declare private api: VRChatAPI
  @Dependency('VRChatPipeline') declare private pipeline: VRChatPipeline
  @Dependency('VRChatAuthentication') declare private auth: VRChatAuthentication
  @Dependency('Database') declare private database: Database

  private readonly logger = createLogger(this.moduleId)
  private repository!: GroupRepository
  private fetcher!: GroupFetcher

  protected onInit(): void {
    this.repository = new GroupRepository(this.database)
    this.fetcher = new GroupFetcher(this.logger, this.repository, this.api)
  }

  public fetchGroupSummary(...args: Parameters<GroupFetcher['fetchGroupSummary']>) {
    return this.fetcher.fetchGroupSummary(...args)
  }

  public fetchGroupSummaries(...args: Parameters<GroupFetcher['fetchGroupSummaries']>) {
    return this.fetcher.fetchGroupSummaries(...args)
  }
}
