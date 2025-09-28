import { createLogger } from '@main/logger'
import { Dependency, Module } from '@shared/module-constructor'
import { FriendsFetcher } from './fetcher'
import { FriendsRepository } from './repository'
import { FriendsEventBinding } from './event-binding'
import { FriendsIPCBinding } from './ipc-binding'
import type { IPCModule } from '../ipc'
import type { MobxState } from '../mobx-state'
import type { VRChatAPI } from '../vrchat-api'
import type { VRChatGroups } from '../vrchat-groups'
import type { VRChatUsers } from '../vrchat-users'
import type { VRChatWorlds } from '../vrchat-worlds'
import type { VRChatPipeline } from '../vrchat-pipeline'
import type { VRChatAuthentication } from '../vrchat-authentication'
import type { VRChatWorkflowCoordinator } from '../vrchat-workflow-coordinator'
import type { BaseFriendInformation, FriendInformation } from '@shared/definition/vrchat-friends'
import type { FriendUpdateDiff } from './types'

export class VRChatFriends extends Module<{
  'friend:delete': (user: FriendInformation) => void
  'friend:add': (user: FriendInformation) => void
  'friend:online': (user: FriendInformation) => void
  'friend:offline': (user: FriendInformation) => void
  'friend:location': (user: FriendInformation) => void
  'friend:active': (user: FriendInformation) => void
  'friend:update': (
    user: FriendInformation,
    diff: FriendUpdateDiff,
    updatedKeys: (keyof BaseFriendInformation)[]
  ) => void
}> {
  @Dependency('IPCModule') declare private ipc: IPCModule
  @Dependency('MobxState') declare private mobx: MobxState
  @Dependency('VRChatAPI') declare private api: VRChatAPI
  @Dependency('VRChatAuthentication') declare private auth: VRChatAuthentication
  @Dependency('VRChatWorlds') declare private worlds: VRChatWorlds
  @Dependency('VRChatPipeline') declare private pipeline: VRChatPipeline
  @Dependency('VRChatUsers') declare private users: VRChatUsers
  @Dependency('VRChatGroups') declare private groups: VRChatGroups
  @Dependency('VRChatWorkflowCoordinator') declare private workflow: VRChatWorkflowCoordinator

  private readonly logger = createLogger(this.moduleId)
  private repository!: FriendsRepository
  private ipcBinding!: FriendsIPCBinding
  private eventBinding!: FriendsEventBinding
  private fetcher!: FriendsFetcher

  protected onInit(): void {
    this.repository = new FriendsRepository(this.moduleId, this.mobx)
    this.ipcBinding = new FriendsIPCBinding(this.ipc, this.repository)
    this.fetcher = new FriendsFetcher(
      this.logger,
      this.repository,
      this.api,
      this.groups,
      this.worlds,
      this.users
    )
    this.eventBinding = new FriendsEventBinding(
      this,
      this.logger,
      this.pipeline,
      this.repository,
      this.fetcher,
      this.users
    )

    this.ipcBinding.bindEvents()
    this.ipcBinding.bindInvokes()
    this.eventBinding.bindEvents()
    this.bindEvents()
  }

  private bindEvents(): void {
    this.workflow.registerPostLoginTask('friends-resolver', 40, async () => {
      await this.refreshFriends(true)
    })

    this.workflow.registerPostLogoutTask('friends-pipeline-shielde', 40, () => {
      this.eventBinding.stopPipeProcessing()
      this.repository.clear()
    })

    this.workflow.on('workflow:start', (type) => {
      if (type === 'post-login') {
        this.repository.setLoadingState(true)
      }
    })

    this.on('friend:active', (friend) => {
      this.logger.info(
        'friend-active',
        friend.userId,
        friend.displayName,
        friend.status,
        friend.platform
      )
    })

    this.on('friend:offline', (friend) => {
      this.logger.info('friend-offline', `${friend.displayName}(${friend.userId})`, friend.platform)
    })

    this.on('friend:online', (friend) => {
      this.logger.info(
        'friend-online',
        `${friend.displayName}(${friend.userId})`,
        friend.location ? `${friend.location.worldName}(${friend.location.worldId})` : 'Private',
        friend.platform
      )
    })

    this.on('friend:location', (friend) => {
      this.logger.info(
        'friend-location',
        `${friend.displayName}(${friend.userId})`,
        friend.location ? `${friend.location.worldName}(${friend.location.worldId})` : 'Private',
        friend.isTraveling ? 'Traveling' : 'Not-Traveling'
      )
    })

    this.on('friend:add', (friend) => {
      this.logger.info('friend-add', `${friend.displayName}(${friend.userId})`)
    })

    this.on('friend:delete', (friend) => {
      this.logger.info('friend-delete', `${friend.displayName}(${friend.userId})`)
    })

    this.on('friend:update', (friend, diff, keys) => {
      this.logger.info(
        'friend-update',
        `${friend.displayName}(${friend.userId})`,
        `before: ${JSON.stringify(diff.before, null, 2)}`,
        `after: ${JSON.stringify(diff.after, null, 2)}`,
        `keys: ${keys.join(',')}`
      )
    })
  }

  public async refreshFriends(force?: boolean) {
    if (this.repository.State.loading && !force) {
      return
    }

    this.eventBinding.stopPipeProcessing()
    this.repository.setLoadingState(true)

    await this.fetcher.initFriends()
    await this.eventBinding.startPipeProcessing(this.pipeline.cachedEvents)

    this.repository.setLoadingState(false)
  }
}
