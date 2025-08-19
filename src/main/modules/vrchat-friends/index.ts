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
import type { FriendSharedState } from '@shared/definition/mobx-shared'

export class VRChatFriends extends Module<{}> {
  @Dependency('IPCModule') declare private ipc: IPCModule
  @Dependency('MobxState') declare private mobx: MobxState
  @Dependency('VRChatAPI') declare private api: VRChatAPI
  @Dependency('VRChatAuthentication') declare private auth: VRChatAuthentication
  @Dependency('VRChatGroups') declare private groups: VRChatGroups
  @Dependency('VRChatWorlds') declare private worlds: VRChatWorlds
  @Dependency('VRChatPipeline') declare private pipeline: VRChatPipeline
  @Dependency('VRChatUsers') declare private users: VRChatUsers
  @Dependency('VRChatWorkflowCoordinator') declare private workflow: VRChatWorkflowCoordinator

  private readonly logger = createLogger(this.moduleId)
  private repository!: FriendsRepository
  private ipcBinding!: FriendsIPCBinding
  private eventBinding!: FriendsEventBinding
  private fetcher!: FriendsFetcher
  private $!: FriendSharedState

  protected onInit(): void {
    this.bindEvents()
    this.repository = new FriendsRepository()
    this.ipcBinding = new FriendsIPCBinding(this.ipc, this.repository)
    this.eventBinding = new FriendsEventBinding(
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

    this.ipcBinding.bindEvents()
    this.ipcBinding.bindInvokes()
    this.eventBinding.bindEvents()
    this.$ = this.mobx.observable(
      this.moduleId,
      {
        loading: false
      },
      ['loading']
    )
  }

  private bindEvents(): void {
    this.workflow.registerPostLoginTask('friends-resolver', 50, async () => {
      await this.refreshFriends(true)
    })

    this.workflow.registerPostLogoutTask('friends-pipeline-shielde', 50, () => {
      this.eventBinding.stopPipeProcessing()
      this.repository.clear()
    })

    this.workflow.on('workflow:start', (type) => {
      if (type === 'post-login') {
        this.mobx.action(() => {
          this.$.loading = true
        })
      }
    })
  }

  public async refreshFriends(force?: boolean) {
    if (this.$.loading && !force) {
      return
    }

    this.eventBinding.stopPipeProcessing()
    this.mobx.action(() => {
      this.$.loading = true
    })

    await this.fetcher.initFriends()
    await this.eventBinding.startPipeProcessing(this.pipeline.cachedEvents)

    this.mobx.action(() => {
      this.$.loading = false
    })
  }
}
