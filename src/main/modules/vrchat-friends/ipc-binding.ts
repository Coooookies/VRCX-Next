import type { IPCModule } from '../ipc'
import type { FriendsStore } from './friend-store'

export class FriendsIPCBinding {
  constructor(
    private ipc: IPCModule,
    private store: FriendsStore
  ) {
    this.bindEvents()
    this.bindInvokes()
  }

  private bindEvents() {
    this.store.on('friend:present', (friends) => {
      this.ipc.send('vrchat-friends:friend-sessions:present', friends)
    })

    this.store.on('friend:add', (friend) => {
      this.ipc.send('vrchat-friends:friend-sessions:add', friend)
    })

    this.store.on('friend:delete', (friendUserId) => {
      this.ipc.send('vrchat-friends:friend-sessions:delete', friendUserId)
    })

    this.store.on('friend:update', (friendUserId, friend) => {
      this.ipc.send('vrchat-friends:friend-sessions:update', friendUserId, friend)
    })

    this.store.on('friend:state', (friendUserId, _, state, platform) => {
      this.ipc.send('vrchat-friends:friend-sessions:state', friendUserId, state, platform)
    })

    this.store.on('friend:location', (friendUserId, _, location) => {
      this.ipc.send('vrchat-friends:friend-sessions:location', friendUserId, location)
    })

    this.store.on('friend:patch-location', (friendUserId, _, location) => {
      this.ipc.send('vrchat-friends:friend-sessions:location', friendUserId, location)
    })

    this.store.on('friend:clear', () => {
      this.ipc.send('vrchat-friends:friend-sessions:clear')
    })
  }

  private bindInvokes() {
    this.ipc.listener.handle('vrchat-friends:friend-sessions:get-friends', () => {
      return this.store.friends
    })
  }
}
