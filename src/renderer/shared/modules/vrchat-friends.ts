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

    this.ipc.listener.on('vrchat-friends:friend-sessions:append', (_, friend) => {
      this.friends.value.push(friend)
    })

    this.ipc.listener.on('vrchat-friends:friend-sessions:remove', (_, userId) => {
      this.friends.value.splice(
        this.friends.value.findIndex((f) => f.userId === userId),
        1
      )
    })

    this.ipc.listener.on('vrchat-friends:friend-sessions:update', (_, friendUserId, friend) => {
      this.updateFriend(friendUserId, friend)
    })

    this.ipc.listener.on('vrchat-friends:friend-sessions:updates', (_, friends) => {
      friends.forEach((friend) => {
        this.updateFriend(friend.userId, friend)
      })
    })

    this.ipc.listener.on('vrchat-friends:friend-sessions:clear', () => {
      this.friends.value = []
    })
  }

  private updateFriend(friendUserId: string, friend: FriendInformation) {
    const index = this.friends.value.findIndex((f) => f.userId === friendUserId)
    if (index !== -1) {
      this.friends.value[index] = friend
    }
  }

  public getFriends() {
    return this.ipc.emitter.invoke('vrchat-friends:friend-sessions:get-friends')
  }

  public get state() {
    return this.$
  }
}
