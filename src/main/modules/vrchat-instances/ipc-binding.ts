import type { IPCModule } from '../ipc'
import type { InstanceRepository } from './repository'

export class InstanceIPCBinding {
  constructor(
    private ipc: IPCModule,
    private repository: InstanceRepository
  ) {}

  public bindEvents() {
    this.repository.on('current-instance:append-events', (events) => {
      this.ipc.send('vrchat-instances:current-instance:append-events', events)
    })

    this.repository.on('current-instance:insert-users', (users) => {
      this.ipc.send('vrchat-instances:current-instance:insert-users', users)
    })

    this.repository.on('current-instance:update-users', (users) => {
      this.ipc.send('vrchat-instances:current-instance:update-users', users)
    })

    this.repository.on('current-instance:remove-users', (userId) => {
      this.ipc.send('vrchat-instances:current-instance:remove-users', userId)
    })

    this.repository.on('current-instance:clear-users', () => {
      this.ipc.send('vrchat-instances:current-instance:clear-users')
    })

    this.repository.on('current-instance:clear-events', () => {
      this.ipc.send('vrchat-instances:current-instance:clear-events')
    })
  }

  public bindInvokes() {
    this.ipc.listener.handle('vrchat-instances:get-current-instance-users', () => {
      return this.repository.currentInstanceUsers
    })

    this.ipc.listener.handle('vrchat-instances:get-current-instance-events', () => {
      return this.repository.currentInstanceEvents
    })
  }
}
