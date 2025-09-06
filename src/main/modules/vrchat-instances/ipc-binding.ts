import type { IPCModule } from '../ipc'
import type { InstanceRepository } from './repository'

export class InstanceIPCBinding {
  constructor(
    private ipc: IPCModule,
    private repository: InstanceRepository
  ) {}

  public bindEvents() {
    this.repository.on('current-instance:append-user-activities', (activities) => {
      this.ipc.send('vrchat-instances:current-instance:append-user-activities', activities)
    })

    this.repository.on('current-instance:append-users', (users) => {
      this.ipc.send('vrchat-instances:current-instance:append-users', users)
    })

    this.repository.on('current-instance:remove-users', (userId) => {
      this.ipc.send('vrchat-instances:current-instance:remove-users', userId)
    })

    this.repository.on('current-instance:clear-users', () => {
      this.ipc.send('vrchat-instances:current-instance:clear-users')
    })

    this.repository.on('current-instance:clear-user-activities', () => {
      this.ipc.send('vrchat-instances:current-instance:clear-user-activities')
    })
  }

  public bindInvokes() {
    this.ipc.listener.handle('vrchat-instances:get-current-instance-users', () => {
      return this.repository.getCurrentInstanceUsers()
    })

    this.ipc.listener.handle('vrchat-instances:get-current-instance-user-activities', () => {
      return this.repository.getCurrentInstanceUserActivities()
    })
  }
}
