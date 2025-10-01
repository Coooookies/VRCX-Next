import { UsersFetcher } from './fetcher'
import { UsersRepository } from './repository'
import { UsersEventBinding } from './event-binding'
import { Dependency, Module } from '@shared/module-constructor'
import { CurrentUserStore } from './current-user-store'
import { createLogger } from '@main/logger'
import { toCurrentUserInformation } from './factory'
import type { VRChatAPI } from '../vrchat-api'
import type { VRChatPipeline } from '../vrchat-pipeline'
import type { VRChatAuthentication } from '../vrchat-authentication'
import type { VRChatWorkflowCoordinator } from '../vrchat-workflow-coordinator'
import type { VRChatGroups } from '../vrchat-groups'
import type { VRChatWorlds } from '../vrchat-worlds'
import type { MobxState } from '../mobx-state'
import type { Database } from '../database'

export class VRChatUsers extends Module {
  @Dependency('VRChatAPI') declare private api: VRChatAPI
  @Dependency('VRChatAuthentication') declare private auth: VRChatAuthentication
  @Dependency('VRChatWorkflowCoordinator') declare private workflow: VRChatWorkflowCoordinator
  @Dependency('VRChatPipeline') declare private pipeline: VRChatPipeline
  @Dependency('VRChatGroups') declare private groups: VRChatGroups
  @Dependency('VRChatWorlds') declare private worlds: VRChatWorlds
  @Dependency('MobxState') declare private mobx: MobxState
  @Dependency('Database') declare private database: Database

  private readonly logger = createLogger(this.moduleId)
  private repository!: UsersRepository
  private eventBinding!: UsersEventBinding
  private currentUser!: CurrentUserStore
  private fetcher!: UsersFetcher

  protected onInit(): void {
    this.repository = new UsersRepository(this.database)
    this.currentUser = new CurrentUserStore(this.mobx, this.groups, this.worlds)
    this.fetcher = new UsersFetcher(this.logger, this.repository, this.api)
    this.eventBinding = new UsersEventBinding(
      this.logger,
      this.repository,
      this.pipeline,
      this.currentUser
    )
    this.bindEvents()

    // unused protect
    void this.eventBinding
  }

  private bindEvents(): void {
    this.workflow.registerPostLoginTask('user-resolver', 40, async () => {
      if (this.auth.currentState.type === 'authenticated') {
        const user = this.auth.currentState.userInfo
        const currentUser = toCurrentUserInformation(user)
        // const currentLocationRaw = user.location || ''
        const currentLocationRaw = ''
        const travelingLocationRaw = ''
        this.currentUser.presentUser(currentUser, currentLocationRaw, travelingLocationRaw)
      }
    })

    this.workflow.registerPostLogoutTask('user-clear', 40, () => {
      this.currentUser.clear()
    })

    this.on('user:location', ({ location, isTraveling }) => {
      this.logger.info(
        'user-location',
        location ? `${location.worldName}(${location.worldId})` : 'Private',
        isTraveling ? 'Traveling' : 'Not-Traveling'
      )
    })

    this.on('user:update', (diff, keys) => {
      this.logger.info(
        'user-update',
        `before: ${JSON.stringify(diff.before, null, 2)}`,
        `after: ${JSON.stringify(diff.after, null, 2)}`,
        `keys: ${keys.join(',')}`
      )
    })
  }

  public saveUserEntities(...args: Parameters<UsersRepository['saveUserEntities']>) {
    return this.repository.saveUserEntities(...args)
  }

  public fetchUsers(...args: Parameters<UsersFetcher['fetchUsers']>) {
    return this.fetcher.fetchUsers(...args)
  }

  public fetchUser(...args: Parameters<UsersFetcher['fetchUser']>) {
    return this.fetcher.fetchUser(...args)
  }

  public fetchUserSummaries(...args: Parameters<UsersFetcher['fetchUserSummaries']>) {
    return this.fetcher.fetchUserSummaries(...args)
  }

  public fetchUserSummary(...args: Parameters<UsersFetcher['fetchUserSummary']>) {
    return this.fetcher.fetchUserSummary(...args)
  }

  public get activeUser() {
    return this.currentUser.activeUser
  }
}
