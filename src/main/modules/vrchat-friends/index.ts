import { createLogger } from '@main/logger'
import { Dependency, Module } from '@shared/module-constructor'
import { FriendsFetcher } from './fetcher'
import { FriendRepository } from './repository'
import type { VRChatAPI } from '../vrchat-api'
import type { VRChatAuthentication } from '../vrchat-authentication'
import type { VRChatWorkflowCoordinator } from '../vrchat-workflow-coordinator'

export class VRChatFriends extends Module<{}> {
  @Dependency('VRChatAPI') declare private api: VRChatAPI
  @Dependency('VRChatAuthentication') declare private auth: VRChatAuthentication
  @Dependency('VRChatWorkflowCoordinator') declare private workflow: VRChatWorkflowCoordinator

  private readonly logger = createLogger(this.moduleId)
  private repository!: FriendRepository
  private fetcher!: FriendsFetcher

  protected onInit(): void {
    this.bindEvents()
    this.repository = new FriendRepository()
    this.fetcher = new FriendsFetcher(this.repository)
  }

  private bindEvents(): void {
    this.workflow.registerPostLoginTask('friends-resolver', 50, () => {
      this.logger.info('task')
    })
  }
}
