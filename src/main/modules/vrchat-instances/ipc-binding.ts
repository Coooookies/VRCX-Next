import type { IPCModule } from '../ipc'
import type { InstanceTracker } from './instance-tracker'

export class InstanceIPCBinding {
  constructor(
    private ipc: IPCModule,
    private tracker: InstanceTracker
  ) {}

  public bindEvents() {
    this.tracker.on('instance:clear', () => {
      this.ipc.send('vrchat-instances:instance-tracker:clear')
    })

    this.tracker.on('instance:player-joined', (_, users) => {
      this.ipc.send('vrchat-instances:instance-tracker:insert-users', users)
    })

    this.tracker.on('instance:player-patch', (_, userId, user) => {
      this.ipc.send('vrchat-instances:instance-tracker:update-user', userId, user)
    })

    this.tracker.on('instance:player-left', (_, userId) => {
      this.ipc.send('vrchat-instances:instance-tracker:remove-user', userId)
    })

    this.tracker.on('instance:event', (_, events) => {
      this.ipc.send('vrchat-instances:instance-tracker:append-events', events)
    })

    this.tracker.on('instance:event-patch', (_, eventId, event) => {
      this.ipc.send('vrchat-instances:instance-tracker:update-event', eventId, event)
    })
  }

  public bindInvokes() {
    this.ipc.listener.handle('vrchat-instances:instance-tracker:get-current-players', () => {
      return this.tracker.currentPlayers
    })

    this.ipc.listener.handle('vrchat-instances:instance-tracker:get-current-events', () => {
      return this.tracker.currentEvents
    })
  }
}
