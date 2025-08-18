import { createLogger } from '@main/logger'
import { Dependency, Module } from '@shared/module-constructor'
import { FriendsFetcher } from './fetcher'
import { FriendRepository } from './repository'
import { FriendEventBinding } from './event-binding'
import type { VRChatAPI } from '../vrchat-api'
import type { VRChatGroups } from '../vrchat-groups'
import type { VRChatUsers } from '../vrchat-users'
import type { VRChatWorlds } from '../vrchat-worlds'
import type { VRChatPipeline } from '../vrchat-pipeline'
import type { VRChatAuthentication } from '../vrchat-authentication'
import type { VRChatWorkflowCoordinator } from '../vrchat-workflow-coordinator'

export class VRChatFriends extends Module<{}> {
  @Dependency('VRChatAPI') declare private api: VRChatAPI
  @Dependency('VRChatAuthentication') declare private auth: VRChatAuthentication
  @Dependency('VRChatGroups') declare private groups: VRChatGroups
  @Dependency('VRChatWorlds') declare private worlds: VRChatWorlds
  @Dependency('VRChatPipeline') declare private pipeline: VRChatPipeline
  @Dependency('VRChatUsers') declare private users: VRChatUsers
  @Dependency('VRChatWorkflowCoordinator') declare private workflow: VRChatWorkflowCoordinator

  private readonly logger = createLogger(this.moduleId)
  private repository!: FriendRepository
  private eventBinding!: FriendEventBinding
  private fetcher!: FriendsFetcher

  protected onInit(): void {
    this.bindEvents()
    this.repository = new FriendRepository()
    this.eventBinding = new FriendEventBinding(
      this.logger,
      this.pipeline,
      this.repository,
      this.groups,
      this.users
    )
    this.fetcher = new FriendsFetcher(
      this.logger,
      this.repository,
      this.api,
      this.groups,
      this.worlds,
      this.users
    )
  }

  private bindEvents(): void {
    this.workflow.registerPostLoginTask('friends-resolver', 50, async () => {
      await this.fetcher.initFriends(() => {})
      await this.eventBinding.startPipeProcessing(this.pipeline.cachedEvents)
    })

    this.workflow.registerPostLogoutTask('friends-pipeline-shielde', 50, () => {
      this.eventBinding.stopPipeProcessing()
    })
  }
}
