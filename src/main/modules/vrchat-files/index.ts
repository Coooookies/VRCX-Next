import { createLogger } from '@main/logger'
import { Dependency, Module } from '@shared/module-constructor'
import { FilesRepository } from './repository'
import { FilesFetcher } from './fetcher'
import { FilesEventBinding } from './event-binding'
import type { VRChatAPI } from '../vrchat-api'
import type { VRChatAuthentication } from '../vrchat-authentication'
import type { ProtocolServer } from '../protocol-server'
import type { Database } from '../database'

export class VRChatFiles extends Module {
  @Dependency('ProtocolServer') declare private protocol: ProtocolServer
  @Dependency('VRChatAPI') declare private api: VRChatAPI
  @Dependency('VRChatAuthentication') declare private auth: VRChatAuthentication
  @Dependency('Database') declare private database: Database

  private readonly logger = createLogger(this.moduleId)
  private repository!: FilesRepository
  private fetcher!: FilesFetcher
  private eventBinding!: FilesEventBinding

  protected onInit(): void {
    this.repository = new FilesRepository(this.database)
    this.fetcher = new FilesFetcher(this.logger, this.api, this.repository)
    this.eventBinding = new FilesEventBinding(
      this.logger,
      this.protocol,
      this.fetcher,
      this.repository
    )

    // unused protect
    void this.eventBinding
  }

  public fetchFileAnalysis(...args: Parameters<FilesFetcher['fetchFileAnalysis']>) {
    return this.fetcher.fetchFileAnalysis(...args)
  }
}
