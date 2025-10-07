import { Dependency, Module } from '@shared/module-constructor'
import { createLogger } from '@main/logger'
import { NotificationCoordinator } from './coordinator'
import { NotificationRepository } from './repository'
import { NotificationFetcher } from './fetcher'
import { NotificationOperation } from './operation'
import { NotificationIPCBinding } from './ipc-binding'
import { NotificationHub } from './notification-hub'
import { NotificationHistory } from './notification-history'
import type { IPCModule } from '../ipc'
import type { VRChatAPI } from '../vrchat-api'
import type { VRChatPipeline } from '../vrchat-pipeline'
import type { VRChatUsers } from '../vrchat-users'
import type { VRChatWorlds } from '../vrchat-worlds'
import type { VRChatGroups } from '../vrchat-groups'
import type { VRChatWorkflowCoordinator } from '../vrchat-workflow-coordinator'
import type { Database } from '../database'
import type { MobxState } from '../mobx-state'

export class VRChatNotifications extends Module {
  @Dependency('IPCModule') declare private ipc: IPCModule
  @Dependency('Database') declare private database: Database
  @Dependency('MobxState') declare private mobx: MobxState
  @Dependency('VRChatAPI') declare private api: VRChatAPI
  @Dependency('VRChatPipeline') declare private pipeline: VRChatPipeline
  @Dependency('VRChatUsers') declare private users: VRChatUsers
  @Dependency('VRChatWorlds') declare private worlds: VRChatWorlds
  @Dependency('VRChatGroups') declare private groups: VRChatGroups
  @Dependency('VRChatWorkflowCoordinator') declare private workflow: VRChatWorkflowCoordinator

  private readonly logger = createLogger(this.moduleId)
  private repository!: NotificationRepository
  private fetcher!: NotificationFetcher
  private operation!: NotificationOperation
  private coordinator!: NotificationCoordinator
  private history!: NotificationHistory
  private ipcBinding!: NotificationIPCBinding
  private hub!: NotificationHub

  protected onInit(): void {
    this.repository = new NotificationRepository(this.moduleId, this.mobx, this.database)
    this.fetcher = new NotificationFetcher(this.logger, this.api)
    this.hub = new NotificationHub(this.groups, this.users)
    this.history = new NotificationHistory(this.repository, this.users)
    this.operation = new NotificationOperation(this.hub, this.api)
    this.ipcBinding = new NotificationIPCBinding(this.ipc, this.hub, this.operation)
    this.coordinator = new NotificationCoordinator(
      this.logger,
      this.fetcher,
      this.hub,
      this.history,
      this.pipeline
    )

    this.workflow.registerPostLoginTask('notifications-resolver', 60, async () => {
      await this.refreshNotifications(true)
    })

    this.workflow.registerPostLogoutTask('notifications-clear', 50, () => {
      this.coordinator.uninitialize()
    })

    this.workflow.on('workflow:start', (type) => {
      if (type === 'post-login') {
        this.repository.setLoadingState(true)
      }
    })

    // unused protect
    void this.ipcBinding
    void this.history
  }

  public async refreshNotifications(force?: boolean) {
    if (this.repository.State.loading && !force) {
      return
    }

    this.mobx.action(() => {
      this.repository.State.loading = true
    })

    await this.coordinator.initialize()

    this.mobx.action(() => {
      this.repository.State.loading = false
    })
  }
}
