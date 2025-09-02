import { createLogger } from '@main/logger'
import { Dependency, Module } from '@shared/module-constructor'
import { FilesRepository } from './repository'
import { FilesFetcher } from './fetcher'
import { FilesEventBinding } from './event-binding'
import type { VRChatAPI } from '../vrchat-api'
import type { VRChatAuthentication } from '../vrchat-authentication'
import type { ProtocolServer } from '../protocol-server'

export class VRChatFiles extends Module<{}> {
  @Dependency('ProtocolServer') declare private protocol: ProtocolServer
  @Dependency('VRChatAPI') declare private api: VRChatAPI
  @Dependency('VRChatAuthentication') declare private auth: VRChatAuthentication

  private readonly logger = createLogger(this.moduleId)
  private repository!: FilesRepository
  private fetcher!: FilesFetcher
  private eventBinding!: FilesEventBinding

  protected onInit(): void {
    this.repository = new FilesRepository()
    this.fetcher = new FilesFetcher(this.api)
    this.eventBinding = new FilesEventBinding(
      this.logger,
      this.protocol,
      this.fetcher,
      this.repository
    )

    this.eventBinding.bindProtocolEvents()
  }
}
