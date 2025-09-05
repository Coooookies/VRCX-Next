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
      this.repository.setUserState(
        this.auth.currentState.type === 'authenticated'
          ? toCurrentUserInformation(this.auth.currentState.userInfo)
          : null
      )
      await this.fetcher.initNotes()
    })

    this.workflow.registerPostLogoutTask('user-notes-clear', 40, () => {
      this.repository.setUserState(null)
      this.repository.setLocationState(null)
      this.repository.clearNotes()
    })
  }

  public get Repository(): UsersRepository {
    return this.repository
  }

  public get Fetcher(): UsersFetcher {
    return this.fetcher
  }

  public get state() {
    return this.repository.State
  }
}
