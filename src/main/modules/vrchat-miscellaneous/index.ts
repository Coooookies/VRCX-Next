import { MiscellaneousRepository } from './repository'
import { MiscellaneousFetcher } from './fetcher'
import { Dependency, Module } from '@shared/module-constructor'
import { createLogger } from '@main/logger'
import type { MobxState } from '../mobx-state'
import type { VRChatAPI } from '../vrchat-api'
import type { VRChatPipeline } from '../vrchat-pipeline'

export class VRChatMiscellaneous extends Module<{}> {
  @Dependency('MobxState') declare private mobx: MobxState
  @Dependency('VRChatAPI') declare private api: VRChatAPI
  @Dependency('VRChatPipeline') declare private pipeline: VRChatPipeline

  private readonly logger = createLogger(this.moduleId)
  private repository!: MiscellaneousRepository
  private fetcher!: MiscellaneousFetcher

  protected onInit(): void {
    this.repository = new MiscellaneousRepository(this.moduleId, this.mobx)
    this.fetcher = new MiscellaneousFetcher(this.logger, this.api, this.repository)
  }

  protected onLoad(): void {
    this.fetcher.fetchServerTime()
  }

  public get Fetcher(): MiscellaneousFetcher {
    return this.fetcher
  }
}
