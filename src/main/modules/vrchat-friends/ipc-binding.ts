import type { IPCModule } from '../ipc'
import type { FriendsSessions } from './friend-sessions'

export class FriendsIPCBinding {
  constructor(
    private ipc: IPCModule,
    private sessions: FriendsSessions
  ) {
    this.bindEvents()
    this.bindInvokes()
  }

  private bindEvents() {
    this.sessions.on('friend:present', (friends) => {
      this.ipc.send('vrchat-friends:friend-sessions:present', friends)
    })

    this.sessions.on('friend:add', (friend) => {
      this.ipc.send('vrchat-friends:friend-sessions:add', friend)
    })

    this.sessions.on('friend:delete', (friendUserId) => {
      this.ipc.send('vrchat-friends:friend-sessions:delete', friendUserId)
    })

    this.sessions.on('friend:update', (friendUserId, friend) => {
      this.ipc.send('vrchat-friends:friend-sessions:update', friendUserId, friend)
    })

    this.sessions.on('friend:state', (friendUserId, _, state, platform) => {
      this.ipc.send('vrchat-friends:friend-sessions:state', friendUserId, state, platform)
    })

    this.sessions.on('friend:location', (friendUserId, _, location) => {
      this.ipc.send('vrchat-friends:friend-sessions:location', friendUserId, location)
    })

    this.sessions.on('friend:patch-location', (friendUserId, _, location) => {
      this.ipc.send('vrchat-friends:friend-sessions:location', friendUserId, location)
    })

    this.sessions.on('friend:clear-location', (friendUserId) => {
      this.ipc.send('vrchat-friends:friend-sessions:location', friendUserId, null)
    })

    this.sessions.on('friend:clear', () => {
      this.ipc.send('vrchat-friends:friend-sessions:clear')
    })
  }

  private bindInvokes() {
    this.ipc.listener.handle('vrchat-friends:friend-sessions:get-friends', () => {
      return this.sessions.friends
    })
  }
}
