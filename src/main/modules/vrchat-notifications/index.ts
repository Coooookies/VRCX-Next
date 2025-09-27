import { Dependency, Module } from '@shared/module-constructor'
import { createLogger } from '@main/logger'
import { NotificationEventBinding } from './event-binding'
import { NotificationRepository } from './repository'
import { NotificationFetcher } from './fetcher'
import { NotificationOperation } from './operation'
import { NotificationIPCBinding } from './ipc-binding'
import type { IPCModule } from '../ipc'
import type { VRChatAPI } from '../vrchat-api'
import type { VRChatPipeline } from '../vrchat-pipeline'
import type { VRChatUsers } from '../vrchat-users'
import type { VRChatWorlds } from '../vrchat-worlds'
import type { VRChatGroups } from '../vrchat-groups'
import type { VRChatWorkflowCoordinator } from '../vrchat-workflow-coordinator'
import type { Database } from '../database'
import type { MobxState } from '../mobx-state'

export class VRChatNotifications extends Module<{}> {
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
  private eventBinding!: NotificationEventBinding
  private ipcBinding!: NotificationIPCBinding

  protected onInit(): void {
    this.repository = new NotificationRepository(this.moduleId, this.mobx, this.database)
    this.operation = new NotificationOperation(this.repository, this.api, this.users)
    this.fetcher = new NotificationFetcher(
      this.logger,
      this.repository,
      this.api,
      this.users,
      this.groups
    )
    this.ipcBinding = new NotificationIPCBinding(this.ipc, this.repository, this.operation)
    this.eventBinding = new NotificationEventBinding(
      this.logger,
      this.repository,
      this.fetcher,
      this.users,
      this.pipeline
    )

    this.ipcBinding.bindEvents()
    this.ipcBinding.bindInvokes()
    this.eventBinding.bindEvents()

    this.workflow.registerPostLoginTask('notifications-resolver', 60, async () => {
      await this.refreshNotifications(true)
    })

    this.workflow.registerPostLogoutTask('notifications-clear', 50, () => {
      this.repository.clear()
    })

    this.workflow.on('workflow:start', (type) => {
      if (type === 'post-login') {
        this.repository.setLoadingState(true)
      }
    })
  }

  public async refreshNotifications(force?: boolean) {
    if (this.repository.State.loading && !force) {
      return
    }

    this.mobx.action(() => {
      this.repository.State.loading = true
    })

    await this.fetcher.initNotifications()

    this.mobx.action(() => {
      this.repository.State.loading = false
    })
  }
}
