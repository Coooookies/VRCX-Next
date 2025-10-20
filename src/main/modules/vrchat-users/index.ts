import { UsersFetcher } from './fetcher'
import { UsersRepository } from './repository'
import { UsersCoordinator } from './coordinator'
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
import type { CurrentUserFriendIds } from './types'

export class VRChatUsers extends Module<{
  'user:friend-ids:update': (friendIds: Readonly<CurrentUserFriendIds>) => void
}> {
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
  private coordinator!: UsersCoordinator
  private currentUser!: CurrentUserStore
  private fetcher!: UsersFetcher

  protected onInit(): void {
    this.repository = new UsersRepository(this.database)
    this.fetcher = new UsersFetcher(this.logger, this.repository, this.api)
    this.currentUser = new CurrentUserStore(this.mobx, this.fetcher, this.groups, this.worlds)
    this.coordinator = new UsersCoordinator(
      this.logger,
      this.repository,
      this.pipeline,
      this.currentUser
    )
    this.bindEvents()

    // unused protect
    void this.coordinator
  }

  private bindEvents(): void {
    this.workflow.registerPostLoginTask('user-resolver', 40, async () => {
      if (this.auth.currentState.type === 'authenticated') {
        const user = this.auth.currentState.userInfo
        const currentUser = toCurrentUserInformation(user)
        const friendIds: CurrentUserFriendIds = {
          total: new Set(user.friends || []),
          online: new Set(user.onlineFriends || []),
          offline: new Set(user.offlineFriends || []),
          active: new Set(user.activeFriends || [])
        }
        // const currentLocationRaw = user.location || ''
        const currentLocationRaw = ''
        const travelingLocationRaw = ''

        this.currentUser.syncInitialUser(
          currentUser,
          friendIds,
          currentLocationRaw,
          travelingLocationRaw
        )
      }
    })

    this.workflow.registerPostLogoutTask('user-clear', 40, () => {
      this.currentUser.logout()
    })

    this.currentUser.on('user:friend-ids:update', (friendIds) => {
      this.emit('user:friend-ids:update', friendIds)
    })

    this.currentUser.on('user:location', (location) => {
      this.logger.info(
        'User location updated:',
        location ? `${location.instance.location}` : 'Private'
      )
    })

    this.currentUser.on('user:update', (user, diff, keys) => {
      this.logger.info('User information updated:', user.displayName, ...keys, JSON.stringify(diff))
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

  public get activeUserFriendIds() {
    return this.currentUser.activeFriendIds
  }
}
