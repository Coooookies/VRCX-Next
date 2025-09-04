import { createLogger } from '@main/logger'
import { Dependency, Module } from '@shared/module-constructor'
import { ImageSelectionRepository } from './repository'
import { ImageSelectionOperation } from './operation'
import { ImageSelectionEventBinding } from './event-binding'
import { ImageSelectionIPCBinding } from './ipc-binding'
import type { IPCModule } from '../ipc'
import type { Database } from '../database'
import type { ProtocolServer } from '../protocol-server'
import type { MainWindow } from '../main-window'

export class ImageSelection extends Module {
  @Dependency('Database') declare private database: Database
  @Dependency('IPCModule') declare private ipc: IPCModule
  @Dependency('ProtocolServer') declare private protocol: ProtocolServer
  @Dependency('MainWindow') declare private window: MainWindow

  private readonly logger = createLogger(this.moduleId)
  private repository!: ImageSelectionRepository
  private operation!: ImageSelectionOperation
  private eventBinding!: ImageSelectionEventBinding
  private ipcBinding!: ImageSelectionIPCBinding

  protected onInit(): void {
    this.repository = new ImageSelectionRepository(this.logger, this.database)
    this.operation = new ImageSelectionOperation(this.logger, this.window, this.repository)
    this.eventBinding = new ImageSelectionEventBinding(this.logger, this.protocol, this.repository)
    this.ipcBinding = new ImageSelectionIPCBinding(this.ipc, this.repository, this.operation)
    this.eventBinding.bindProtocolEvents()
    this.ipcBinding.bindInvokes()
  }

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
