import { Dependency, Module } from '@shared/module-constructor'
import { AvatarRepository } from './repository'
import { AvatarFetcher } from './fetcher'
import { createLogger } from '@main/logger'
import type { VRChatAPI } from '../vrchat-api'
import type { VRChatPipeline } from '../vrchat-pipeline'
import type { VRChatAuthentication } from '../vrchat-authentication'
import type { Database } from '../database'

export class VRChatAvatars extends Module {
  @Dependency('VRChatAPI') declare private api: VRChatAPI
  @Dependency('VRChatPipeline') declare private pipeline: VRChatPipeline
  @Dependency('VRChatAuthentication') declare private auth: VRChatAuthentication
  @Dependency('Database') declare private database: Database

  private readonly logger = createLogger(this.moduleId)
  private repository!: AvatarRepository
  private fetcher!: AvatarFetcher

  protected onInit(): void {
    this.repository = new AvatarRepository(this.database)
    this.fetcher = new AvatarFetcher(this.logger, this.repository, this.api)
  }

  public fetchReferenceAvatar(...args: Parameters<AvatarFetcher['fetchReferenceAvatar']>) {
    return this.fetcher.fetchReferenceAvatar(...args)
  }

  public fetchReferenceAvatars(...args: Parameters<AvatarFetcher['fetchReferenceAvatars']>) {
    return this.fetcher.fetchReferenceAvatars(...args)
  }
}
