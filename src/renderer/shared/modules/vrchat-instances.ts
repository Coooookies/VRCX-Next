import { ref } from 'vue'
import { Dependency, Module } from '@shared/module-constructor'
import type { IPCRenderer } from './ipc'
import type { MobxRenderer } from './mobx-renderer'
import type { InstanceSharedState } from '@shared/definition/mobx-shared'
import type { InstanceUserActivity, InstanceUserSummary } from '@shared/definition/vrchat-instances'

export class VRChatInstances extends Module {
  @Dependency('IPCRenderer') declare private ipc: IPCRenderer
  @Dependency('MobxRenderer') declare private mobx: MobxRenderer

  public readonly currentInstanceUsers = ref<InstanceUserSummary[]>([])
  public readonly currentInstanceUserActivities = ref<InstanceUserActivity[]>([])
  private $!: InstanceSharedState

  protected async onInit() {
    this.bindEvents()
    this.$ = this.mobx.use<InstanceSharedState>(this.moduleId)
    this.currentInstanceUsers.value = await this.getCurrentInstanceUsers()
    this.currentInstanceUserActivities.value = await this.getCurrentInstanceUserActivities()
  }

  private bindEvents() {
    this.ipc.listener.on(
      'vrchat-instances:current-instance:append-user-activities',
      (_, notifications) => {
        this.currentInstanceUserActivities.value.push(...notifications)
      }
    )

    this.ipc.listener.on('vrchat-instances:current-instance:append-users', (_, users) => {
      this.currentInstanceUsers.value.push(...users)
    })

    this.ipc.listener.on('vrchat-instances:current-instance:remove-users', (_, userId) => {
      this.currentInstanceUsers.value = this.currentInstanceUsers.value.filter(
        (user) => user.userId !== userId
      )
    })

    this.ipc.listener.on('vrchat-instances:current-instance:clear-users', () => {
      this.currentInstanceUsers.value = []
    })

    this.ipc.listener.on('vrchat-instances:current-instance:clear-user-activities', () => {
      this.currentInstanceUserActivities.value = []
    })
  }

  public getCurrentInstanceUsers() {
    return this.ipc.emitter.invoke('vrchat-instances:get-current-instance-users')
  }

  public getCurrentInstanceUserActivities() {
    return this.ipc.emitter.invoke('vrchat-instances:get-current-instance-user-activities')
  }

  public get state() {
    return this.$
  }
}
