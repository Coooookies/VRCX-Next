import { ref } from 'vue'
import { Dependency, Module } from '@shared/module-constructor'
import type { IPCRenderer } from './ipc'
import type { MobxRenderer } from './mobx-renderer'
import type { MiscellaneousSharedState } from '@shared/definition/mobx-shared'
import type { NotificationInformation } from '@shared/definition/vrchat-notifications'

export class VRChatMiscellaneous extends Module {
  @Dependency('IPCRenderer') declare private ipc: IPCRenderer
  @Dependency('MobxRenderer') declare private mobx: MobxRenderer

  public readonly notifications = ref<NotificationInformation[]>([])
  private $!: MiscellaneousSharedState

  protected async onInit() {
    this.$ = this.mobx.use<MiscellaneousSharedState>(this.moduleId)
  }

  public getServerDate() {
    return new Date(Date.now() + this.$.serverTimeOffset)
  }

  public get state() {
    return this.$
  }
}
