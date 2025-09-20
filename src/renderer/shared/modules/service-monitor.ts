import { Dependency, Module } from '@shared/module-constructor'
import type { IPCRenderer } from './ipc'
import type { MobxRenderer } from './mobx-renderer'
import type { ServiceMonitorSharedState } from '@shared/definition/mobx-shared'

export class ServiceMonitor extends Module {
  @Dependency('IPCRenderer') declare private ipc: IPCRenderer
  @Dependency('MobxRenderer') declare private mobx: MobxRenderer

  private $!: ServiceMonitorSharedState

  protected async onInit() {
    this.$ = this.mobx.use<ServiceMonitorSharedState>(this.moduleId)
  }

  public get state() {
    return this.$
  }
}
