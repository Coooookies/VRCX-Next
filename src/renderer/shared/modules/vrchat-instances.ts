import { shallowRef } from 'vue'
import { Dependency, Module } from '@shared/module-constructor'
import type { IPCRenderer } from './ipc'
import type { MobxRenderer } from './mobx-renderer'
import type { InstanceSharedState } from '@shared/definition/mobx-shared'
import type { InstanceUserActivity, InstanceUserSummary } from '@shared/definition/vrchat-instances'

export class VRChatInstances extends Module {
  @Dependency('IPCRenderer') declare private ipc: IPCRenderer
  @Dependency('MobxRenderer') declare private mobx: MobxRenderer

  public readonly currentInstanceUsers = shallowRef<InstanceUserSummary[]>([])
  public readonly currentInstanceUserActivities = shallowRef<InstanceUserActivity[]>([])
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
        this.currentInstanceUserActivities.value = [
          ...this.currentInstanceUserActivities.value,
          ...notifications
        ]
      }
    )

    this.ipc.listener.on('vrchat-instances:current-instance:insert-users', (_, users) => {
      this.currentInstanceUsers.value = [...this.currentInstanceUsers.value, ...users]
    })

    this.ipc.listener.on('vrchat-instances:current-instance:update-users', (_, users) => {
      const userMap = new Map(users.map((user) => [user.userId, user]))

      // = =
      this.currentInstanceUsers.value = this.currentInstanceUsers.value.map((user) =>
        userMap.has(user.userId) ? userMap.get(user.userId)! : user
      )
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
