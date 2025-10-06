import { createLogger } from '@main/logger'
import { toFriendUserEntity } from '../vrchat-users/factory'
import { Dependency, Module } from '@shared/module-constructor'
import { FriendsSessions } from './friend-sessions'
import { FriendsFetcher } from './fetcher'
import { FriendsCoordinator } from './coordinator'
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
import type { FriendSharedState } from '@shared/definition/mobx-shared'

export class VRChatFriends extends Module {
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
  private sessions!: FriendsSessions
  private fetcher!: FriendsFetcher
  private coordinator!: FriendsCoordinator
  private ipcBinding!: FriendsIPCBinding
  private $!: FriendSharedState

  protected onInit(): void {
    this.fetcher = new FriendsFetcher(this.logger, this.api)
    this.sessions = new FriendsSessions(this.groups, this.worlds, this.users)
    this.coordinator = new FriendsCoordinator(
      this.logger,
      this.pipeline,
      this.sessions,
      this.fetcher
    )
    this.ipcBinding = new FriendsIPCBinding(this.ipc, this.sessions)
    this.$ = this.mobx.observable<FriendSharedState>(
      this.moduleId,
      {
        loading: false
      },
      ['loading']
    )

    this.bindEvents()

    void this.ipcBinding
  }

  private bindEvents(): void {
    this.workflow.on('workflow:start', () => {
      this.mobx.action(() => {
        this.$.loading = true
      })
    })

    this.workflow.registerPostLoginTask('friends-resolver', 40, async () => {
      await this.coordinator.initialize()
      this.mobx.action(() => {
        this.$.loading = false
      })
    })

    this.workflow.registerPostLogoutTask('friends-pipeline-shielde', 40, () => {
      this.coordinator.uninitialize()
    })

    this.sessions.on('sync:present-friends', (friends) => {
      this.users.saveUserEntities(friends.map((f) => toFriendUserEntity(f)))
    })

    this.sessions.on('event:friend-add', (friend) => {
      this.logger.info(`Friend added: ${friend.displayName} (${friend.userId})`)
    })

    this.sessions.on('event:friend-delete', (friendUserId, friend) => {
      this.logger.info(`Friend deleted: ${friend.displayName} (${friendUserId})`)
    })

    this.sessions.on('event:friend-online', (friendUserId, friend) => {
      this.logger.info(`Friend online: ${friend.displayName} (${friendUserId})`)
    })

    this.sessions.on('event:friend-web-active', (friendUserId, friend) => {
      this.logger.info(`Friend web active: ${friend.displayName} (${friendUserId})`)
    })

    this.sessions.on('event:friend-offline', (friendUserId, friend) => {
      this.logger.info(`Friend offline: ${friend.displayName} (${friendUserId})`)
    })

    this.sessions.on('event:friend-update', (friendUserId, friend, diff, keys) => {
      this.logger.info(
        `Friend updated: ${friend.displayName} (${friendUserId})`,
        ...keys,
        JSON.stringify(diff)
      )
    })

    this.sessions.on('event:friend-location', (friendUserId, friend, location, detailPromise) => {
      this.logger.info(
        `Friend location changed: ${friend.displayName} (${friendUserId}) ${location?.instance.location || 'Private'}`
      )

      detailPromise?.then((detail) => {
        this.logger.info(
          `Friend location detail patched: ${friend.displayName} (${friendUserId}) ${detail?.referenceWorld?.worldName}(${detail?.referenceWorld?.worldId})`
        )
      })
    })
  }
}
