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
    this.friends.value = await this.getFriends()
  }

  private bindEvents() {
    this.ipc.listener.on('vrchat-friends:friend-sessions:present', (_, friends) => {
      this.friends.value.push(...friends)
    })

    this.ipc.listener.on('vrchat-friends:friend-sessions:add', (_, friend) => {
      this.friends.value.push(friend)
    })

    this.ipc.listener.on(
      'vrchat-friends:friend-sessions:state',
      (_, friendUserId, state, platform) => {
        const index = this.friends.value.findIndex((f) => f.userId === friendUserId)
        if (index !== -1) {
          this.friends.value[index] = {
            ...this.friends.value[index],
            state,
            platform
          }
        }
      }
    )

    this.ipc.listener.on('vrchat-friends:friend-sessions:delete', (_, userId) => {
      this.friends.value.splice(
        this.friends.value.findIndex((f) => f.userId === userId),
        1
      )
    })

    this.ipc.listener.on('vrchat-friends:friend-sessions:update', (_, friendUserId, friend) => {
      const index = this.friends.value.findIndex((f) => f.userId === friendUserId)
      if (index !== -1) {
        this.friends.value[index] = {
          ...this.friends.value[index],
          ...friend
        }
      }
    })

    this.ipc.listener.on('vrchat-friends:friend-sessions:location', (_, friendUserId, location) => {
      const index = this.friends.value.findIndex((f) => f.userId === friendUserId)
      if (index !== -1) {
        this.friends.value[index] = {
          ...this.friends.value[index],
          location
        }
      }
    })

    this.ipc.listener.on('vrchat-friends:friend-sessions:clear', () => {
      this.friends.value = []
    })
  }

  public getFriends() {
    return this.ipc.emitter.invoke('vrchat-friends:friend-sessions:get-friends')
  }

  public get state() {
    return this.$
  }
}
