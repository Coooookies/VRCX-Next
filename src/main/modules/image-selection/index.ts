import { createLogger } from '@main/logger'
import { Dependency, Module } from '@shared/module-constructor'
import { ImageSelectionRepository } from './repository'
import { ImageSelectionOperation } from './operation'
import type { Database } from '../database'

export class ImageSelection extends Module {
  @Dependency('Database') declare private database: Database

  private readonly logger = createLogger(this.moduleId)
  private repository!: ImageSelectionRepository
  private operation!: ImageSelectionOperation

  protected onInit(): void {
    this.repository = new ImageSelectionRepository(this.database)
    this.operation = new ImageSelectionOperation(this.logger, this.repository)
  }
}
