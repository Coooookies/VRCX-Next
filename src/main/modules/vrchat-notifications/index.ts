import { Dependency, Module } from '@shared/module-constructor'
import { createLogger } from '@main/logger'
import { NotificationEventBinding } from './event-binding'
import { NotificationRepository } from './repository'
import { NotificationFetcher } from './fetcher'
import type { VRChatAPI } from '../vrchat-api'
import type { VRChatPipeline } from '../vrchat-pipeline'
import type { VRChatUsers } from '../vrchat-users'
import type { VRChatWorlds } from '../vrchat-worlds'
import type { VRChatGroups } from '../vrchat-groups'
import type { VRChatWorkflowCoordinator } from '../vrchat-workflow-coordinator'
import type { Database } from '../database'

export class VRChatNotifications extends Module<{}> {
  @Dependency('VRChatAPI') declare private api: VRChatAPI
  @Dependency('VRChatPipeline') declare private pipeline: VRChatPipeline
  @Dependency('VRChatUsers') declare private users: VRChatUsers
  @Dependency('VRChatWorlds') declare private worlds: VRChatWorlds
  @Dependency('VRChatGroups') declare private groups: VRChatGroups
  @Dependency('VRChatWorkflowCoordinator') declare private workflow: VRChatWorkflowCoordinator
  @Dependency('Database') declare private database: Database

  private readonly logger = createLogger(this.moduleId)
  private repository!: NotificationRepository
  private fetcher!: NotificationFetcher
  private eventBinding!: NotificationEventBinding

  protected onInit(): void {
    this.repository = new NotificationRepository(this.database)
    this.fetcher = new NotificationFetcher(
      this.logger,
      this.repository,
      this.api,
      this.users,
      this.worlds,
      this.groups
    )
    this.eventBinding = new NotificationEventBinding(
      this.logger,
      this.repository,
      this.fetcher,
      this.pipeline
    )

    this.eventBinding.bindEvents()
    this.workflow.registerPostLoginTask('notifications-resolver', 60, async () => {
      await this.fetcher.initNotifications()
    })

    this.workflow.registerPostLogoutTask('notifications-clear', 50, () => {
      this.repository.clear()
    })
  }

  public get Repository(): NotificationRepository {
    return this.repository
  }

  public get Fetcher(): NotificationFetcher {
    return this.fetcher
  }
}
