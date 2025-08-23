import { Dependency, Module } from '@shared/module-constructor'
import { createLogger } from '@main/logger'
import { NotificationRepository } from './repository'
import { NotificationFetcher } from './fetcher'
import type { VRChatAPI } from '../vrchat-api'
import type { VRChatPipeline } from '../vrchat-pipeline'
import type { VRChatWorkflowCoordinator } from '../vrchat-workflow-coordinator'
import type { Database } from '../database'

export class VRChatNotifications extends Module<{}> {
  @Dependency('VRChatAPI') declare private api: VRChatAPI
  @Dependency('VRChatPipeline') declare private pipeline: VRChatPipeline
  @Dependency('Database') declare private database: Database
  @Dependency('VRChatWorkflowCoordinator') declare private workflow: VRChatWorkflowCoordinator

  private readonly logger = createLogger(this.moduleId)
  private repository!: NotificationRepository
  private fetcher!: NotificationFetcher

  protected onInit(): void {
    this.repository = new NotificationRepository()
    this.fetcher = new NotificationFetcher(this.logger, this.repository, this.api)

    this.workflow.registerPostLoginTask('notifications-resolver', 60, async () => {
      await this.fetcher.initNotifications()
    })
  }

  public get Repository(): NotificationRepository {
    return this.repository
  }

  public get Fetcher(): NotificationFetcher {
    return this.fetcher
  }
}
