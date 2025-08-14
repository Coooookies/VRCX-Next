import { Dependency, Module } from '@shared/module-constructor'
import type { ElectronModule } from './electron'
import type { IPCModule } from './ipc'

export class Runtime extends Module {
  @Dependency('ElectronModule') declare private electron: ElectronModule
  @Dependency('IPCModule') declare private ipc: IPCModule

  protected onInit(): void {
    this.bindInvokes()
  }

  private bindInvokes() {
    this.ipc.listener.handle('runtime:relaunch', () => {
      return this.relaunch()
    })
  }

  public relaunch() {
    this.electron.relaunch()
  }
}
