import { createLogger } from '@main/logger'
import { Dependency, Module } from '@shared/module-constructor'
import { ImageSelectionRepository } from './repository'
import { ImageSelectionOperation } from './operation'
import { ImageSelectionEventBinding } from './event-binding'
import type { Database } from '../database'
import type { ProtocolServer } from '../protocol-server'

export class ImageSelection extends Module {
  @Dependency('Database') declare private database: Database
  @Dependency('ProtocolServer') declare private protocol: ProtocolServer

  private readonly logger = createLogger(this.moduleId)
  private repository!: ImageSelectionRepository
  private operation!: ImageSelectionOperation
  private eventBinding!: ImageSelectionEventBinding

  protected onInit(): void {
    this.repository = new ImageSelectionRepository(this.logger, this.database)
    this.operation = new ImageSelectionOperation(this.logger, this.repository)
    this.eventBinding = new ImageSelectionEventBinding(this.logger, this.protocol, this.repository)
    this.eventBinding.bindProtocolEvents()
  }

  // protected onLoad(): void {
  //   setTimeout(() => {
  //     this.operation.selectAndCacheSelection()
  //   }, 5000)
  // }

  public get Operation(): ImageSelectionOperation {
    return this.operation
  }

  public get Repository(): ImageSelectionRepository {
    return this.repository
  }

  public get EventBinding(): ImageSelectionEventBinding {
    return this.eventBinding
  }
}
