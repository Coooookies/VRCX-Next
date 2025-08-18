import { ref } from 'vue'
import { Dependency, Module } from '@shared/module-constructor'
import type { IPCRenderer } from './ipc'
import type { MobxRenderer } from './mobx-renderer'
import type { FriendSharedState } from '@shared/definition/mobx-shared'
import type { FriendInformation } from '@shared/definition/vrchat-friends'

export class VRChatFriends extends Module {
  @Dependency('IPCRenderer') declare private ipc: IPCRenderer
  @Dependency('MobxRenderer') declare private mobx: MobxRenderer

  public readonly friends = ref<FriendInformation[]>([])
  private $!: FriendSharedState

  protected async onInit() {
    this.bindEvents()
    this.$ = this.mobx.use<FriendSharedState>(this.moduleId)
    this.friends.value = await this.getAllFriends()
  }

  private bindEvents() {
    this.ipc.listener.on('vrchat-friends:friend:list-insert', (_, users) => {
      this.friends.value.push(...users)
    })

    this.ipc.listener.on('vrchat-friends:friend:list-update', (_, users) => {
      users.forEach((user) => {
        const index = this.friends.value.findIndex((f) => f.userId === user.userId)
        if (index !== -1) {
          this.friends.value[index] = user
        }
      })
    })

    this.ipc.listener.on('vrchat-friends:friend:list-delete', (_, userId) => {
      this.friends.value.splice(
        this.friends.value.findIndex((f) => f.userId === userId),
        1
      )
    })

    this.ipc.listener.on('vrchat-friends:friend:list-clear', () => {
      this.friends.value = []
    })
  }

  public getAllFriends() {
    return this.ipc.emitter.invoke('vrchat-friends:get-friends')
  }

  public get state() {
    return this.$
  }
}
