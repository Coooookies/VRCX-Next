import { Dependency, Module } from '@shared/module-constructor'
import type { IPCRenderer } from './ipc'

export class Runtime extends Module {
  @Dependency('IPCRenderer') declare private ipc: IPCRenderer

  public relaunch() {
    return this.ipc.emitter.invoke('runtime:relaunch')
  }
}
