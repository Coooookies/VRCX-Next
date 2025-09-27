import { UsersFetcher } from './fetcher'
import { UsersRepository } from './repository'
import { UsersEventBinding } from './event-binding'
import { Dependency, Module } from '@shared/module-constructor'
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

export class VRChatUsers extends Module<{}> {
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
  private fetcher!: UsersFetcher

  protected onInit(): void {
    this.repository = new UsersRepository(this.moduleId, this.mobx, this.database)
    this.fetcher = new UsersFetcher(
      this.logger,
      this.repository,
      this.api,
      this.worlds,
      this.groups
    )
    this.eventBinding = new UsersEventBinding(
      this.logger,
      this.repository,
      this.pipeline,
      this.fetcher
    )
    this.bindEvents()
    this.eventBinding.bindEvents()
  }

  private bindEvents(): void {
    this.workflow.registerPostLoginTask('user-notes-resolver', 40, async () => {
      if (this.auth.currentState.type === 'authenticated') {
        this.repository.setUserState(toCurrentUserInformation(this.auth.currentState.userInfo))
        this.repository.setFriendUserIds(this.auth.currentState.userInfo.friends)
        await this.fetcher.fetchNotes()
      }
    })

    this.workflow.registerPostLogoutTask('user-notes-clear', 40, () => {
      this.repository.setUserState(null)
      this.repository.setLocationState(null)
      this.repository.setFriendUserIds([])
      this.repository.clearNotes()
    })
  }

  public fetchUserLocation(...args: Parameters<UsersFetcher['fetchUserLocation']>) {
    return this.fetcher.fetchUserLocation(...args)
  }

  public enrichLocationInstance(...args: Parameters<UsersFetcher['enrichLocationInstance']>) {
    return this.fetcher.enrichLocationInstance(...args)
  }

  public saveUserEntities(...args: Parameters<UsersRepository['saveUserEntities']>) {
    return this.repository.saveUserEntities(...args)
  }

  public getFriendUserIndex(...args: Parameters<UsersRepository['getFriendUserIndex']>) {
    return this.repository.getFriendUserIndex(...args)
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

  public get state() {
    return this.repository.State
  }

  public get currentUser() {
    return this.repository.State.user
  }
}
