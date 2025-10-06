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
    this.sessions.on('sync:present-friends', (friends) => {
      this.ipc.send('vrchat-friends:friend-sessions:present', friends)
    })

    this.sessions.on('sync:append-friend', (friend) => {
      this.ipc.send('vrchat-friends:friend-sessions:append', friend)
    })

    this.sessions.on('sync:remove-friend', (friendUserId) => {
      this.ipc.send('vrchat-friends:friend-sessions:remove', friendUserId)
    })

    this.sessions.on('sync:update-friend', (friendUserId, friend) => {
      this.ipc.send('vrchat-friends:friend-sessions:update', friendUserId, friend)
    })

    this.sessions.on('sync:update-friends', (friends) => {
      this.ipc.send('vrchat-friends:friend-sessions:updates', friends)
    })

    this.sessions.on('sync:clear-friends', () => {
      this.ipc.send('vrchat-friends:friend-sessions:clear')
    })
  }

  private bindInvokes() {
    this.ipc.listener.handle('vrchat-friends:friend-sessions:get-friends', () => {
      return this.sessions.friends
    })
  }
}
