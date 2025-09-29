import type { IPCModule } from '../ipc'
import type { FriendsRepository } from './repository'

export class FriendsIPCBinding {
  constructor(
    private ipc: IPCModule,
    private repository: FriendsRepository
  ) {
    this.bindEvents()
    this.bindInvokes()
  }

  private bindEvents() {
    this.repository.on('friends:insert', (users) => {
      this.ipc.send('vrchat-friends:friend:list-insert', users)
    })

    this.repository.on('friends:update', (users) => {
      this.ipc.send('vrchat-friends:friend:list-update', users)
    })

    this.repository.on('friends:delete', (userId) => {
      this.ipc.send('vrchat-friends:friend:list-delete', userId)
    })

    this.repository.on('friends:clear', () => {
      this.ipc.send('vrchat-friends:friend:list-clear')
    })
  }

  private bindInvokes() {
    this.ipc.listener.handle('vrchat-friends:get-friends', () => {
      return this.repository.getAll()
    })
  }
}
