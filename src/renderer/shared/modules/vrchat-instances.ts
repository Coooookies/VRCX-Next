import { ref } from 'vue'
import { Dependency, Module } from '@shared/module-constructor'
import type { IPCRenderer } from './ipc'
import type { MobxRenderer } from './mobx-renderer'
import type { InstanceSharedState } from '@shared/definition/mobx-shared'
import type { InstanceEventMessage, InstanceUserSummary } from '@shared/definition/vrchat-instances'

export class VRChatInstances extends Module {
  @Dependency('IPCRenderer') declare private ipc: IPCRenderer
  @Dependency('MobxRenderer') declare private mobx: MobxRenderer

  public readonly currentInstanceUsers = ref<InstanceUserSummary[]>([])
  public readonly currentInstanceEvents = ref<InstanceEventMessage[]>([])
  private $!: InstanceSharedState

  protected async onInit() {
    this.bindEvents()
    this.$ = this.mobx.use<InstanceSharedState>(this.moduleId)
    this.currentInstanceUsers.value = await this.getCurrentInstanceUsers()
    this.currentInstanceEvents.value = await this.getCurrentInstanceEvents()
  }

  private bindEvents() {
    this.ipc.listener.on('vrchat-instances:current-instance:append-events', (_, events) => {
      this.currentInstanceEvents.value.push(...events)
    })

    this.ipc.listener.on('vrchat-instances:current-instance:insert-users', (_, users) => {
      this.currentInstanceUsers.value.push(...users)
    })

    this.ipc.listener.on('vrchat-instances:current-instance:update-users', (_, users) => {
      for (const updatedUser of users) {
        const i = this.currentInstanceUsers.value.findIndex((u) => u.userId === updatedUser.userId)
        if (i !== -1) {
          this.currentInstanceUsers.value[i] = updatedUser
        }
      }
    })

    this.ipc.listener.on('vrchat-instances:current-instance:remove-users', (_, userId) => {
      this.currentInstanceUsers.value = this.currentInstanceUsers.value.filter(
        (user) => user.userId !== userId
      )
    })

    this.ipc.listener.on('vrchat-instances:current-instance:clear-users', () => {
      this.currentInstanceUsers.value = []
    })

    this.ipc.listener.on('vrchat-instances:current-instance:clear-events', () => {
      this.currentInstanceEvents.value = []
    })
  }

  public getCurrentInstanceUsers() {
    return this.ipc.emitter.invoke('vrchat-instances:get-current-instance-users')
  }

  public getCurrentInstanceEvents() {
    return this.ipc.emitter.invoke('vrchat-instances:get-current-instance-events')
  }

  public get state() {
    return this.$
  }
}
