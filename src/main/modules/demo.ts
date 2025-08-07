import { createLogger } from '@main/logger'
import { Dependency, Module } from '@shared/module-constructor'
import type { IPCModule } from './ipc'
import type { MainWindow } from './main-window'

export class DemoModule extends Module {
  @Dependency('IPCModule') declare ipc: IPCModule
  @Dependency('MainWindow') declare mainWindow: MainWindow

  private logger = createLogger(this.moduleId)

  protected onInit(): void {
    this.bindEvents()
    this.bindInvokes()
  }

  private bindEvents(): void {
    this.mainWindow.on('ready-to-show', () => {
      this.ipc.send('text', 'hello')
    })

    this.ipc.listener.on('ping', (_, args1) => {
      this.logger.debug('ping', args1)
    })
  }

  private bindInvokes(): void {
    this.ipc.listener.handle('test-invoke', (_, message) => {
      return message.split(message)
    })
  }
}
