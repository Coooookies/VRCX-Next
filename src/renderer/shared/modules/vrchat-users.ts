import { Dependency, Module } from '@shared/module-constructor'
import type { IPCRenderer } from './ipc'
import type { MobxRenderer } from './mobx-renderer'
import type { UserStoreSharedState } from '@shared/definition/mobx-shared'

export class VRChatUsers extends Module {
  @Dependency('IPCRenderer') declare private ipc: IPCRenderer
  @Dependency('MobxRenderer') declare private mobx: MobxRenderer

  private $currentUser!: UserStoreSharedState

  protected async onInit() {
    this.$currentUser = this.mobx.use<UserStoreSharedState>('VRChatUsers:CurrentUserStore')
  }

  public get currentUser() {
    return this.$currentUser
  }
}
