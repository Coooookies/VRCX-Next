import { ref } from 'vue'
import { Dependency, Module } from '@shared/module-constructor'
import type { IPCRenderer } from './ipc'
import type { MobxRenderer } from './mobx-renderer'
import type {
  InstanceEventMessage,
  InstanceUserWithInformation
} from '@shared/definition/vrchat-instances'
import type { InstanceTrackerSharedState } from '@shared/definition/mobx-shared'

export class VRChatInstances extends Module {
  @Dependency('IPCRenderer') declare private ipc: IPCRenderer
  @Dependency('MobxRenderer') declare private mobx: MobxRenderer

  public readonly currentInstancePlayers = ref<InstanceUserWithInformation[]>([])
  public readonly currentInstanceEvents = ref<InstanceEventMessage[]>([])
  private $tracker!: InstanceTrackerSharedState

  protected async onInit() {
    this.bindEvents()
    this.$tracker = this.mobx.use<InstanceTrackerSharedState>('VRChatInstances:InstanceTracker')
    this.currentInstancePlayers.value = await this.getCurrentInstancePlayers()
    this.currentInstanceEvents.value = await this.getCurrentInstanceEvents()
  }

  private bindEvents() {
    this.ipc.listener.on('vrchat-instances:instance-tracker:append-events', (_, events) => {
      this.currentInstanceEvents.value.push(...events)
    })

    this.ipc.listener.on('vrchat-instances:instance-tracker:update-event', (_, eventId, event) => {
      const i = this.currentInstanceEvents.value.findIndex((u) => u.eventId === eventId)
      if (i !== -1) {
        this.currentInstanceEvents.value[i] = event
      }
    })

    this.ipc.listener.on('vrchat-instances:instance-tracker:insert-users', (_, users) => {
      this.currentInstancePlayers.value.push(...users)
    })

    this.ipc.listener.on('vrchat-instances:instance-tracker:update-user', (_, userId, user) => {
      const i = this.currentInstancePlayers.value.findIndex((u) => u.userId === userId)
      if (i !== -1) {
        this.currentInstancePlayers.value[i] = user
      }
    })

    this.ipc.listener.on('vrchat-instances:instance-tracker:remove-user', (_, userId) => {
      this.currentInstancePlayers.value = this.currentInstancePlayers.value.filter(
        (user) => user.userId !== userId
      )
    })

    this.ipc.listener.on('vrchat-instances:instance-tracker:clear', () => {
      this.currentInstancePlayers.value = []
      this.currentInstanceEvents.value = []
    })
  }

  public getCurrentInstancePlayers() {
    return this.ipc.emitter.invoke('vrchat-instances:instance-tracker:get-current-players')
  }

  public getCurrentInstanceEvents() {
    return this.ipc.emitter.invoke('vrchat-instances:instance-tracker:get-current-events')
  }

  public get trackerState() {
    return this.$tracker
  }
}
