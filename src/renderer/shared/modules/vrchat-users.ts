import { Dependency, Module } from '@shared/module-constructor'
import type { IPCRenderer } from './ipc'
import type { MobxRenderer } from './mobx-renderer'
import type { UserSharedState } from '@shared/definition/mobx-shared'

export class VRChatUsers extends Module {
  @Dependency('IPCRenderer') declare private ipc: IPCRenderer
  @Dependency('MobxRenderer') declare private mobx: MobxRenderer

  private $!: UserSharedState

  protected async onInit() {
    this.$ = this.mobx.use<UserSharedState>(this.moduleId)
  }

  public get state() {
    return this.$
  }
}
