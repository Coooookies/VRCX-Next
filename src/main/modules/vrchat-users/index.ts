import { UsersFetcher } from './fetcher'
import { UsersRepository } from './repository'
import { Dependency, Module } from '@shared/module-constructor'
import { createLogger } from '@main/logger'
import type { VRChatAPI } from '../vrchat-api'
import type { VRChatWorkflowCoordinator } from '../vrchat-workflow-coordinator'

export class VRChatUsers extends Module<{}> {
  @Dependency('VRChatAPI') declare private api: VRChatAPI
  @Dependency('VRChatWorkflowCoordinator') declare private workflow: VRChatWorkflowCoordinator

  private readonly logger = createLogger(this.moduleId)
  private repository!: UsersRepository
  private fetcher!: UsersFetcher

  protected onInit(): void {
    this.repository = new UsersRepository()
    this.fetcher = new UsersFetcher(this.logger, this.repository, this.api)
    this.bindEvents()
  }

  private bindEvents(): void {
    this.workflow.registerPostLoginTask('user-notes-resolver', 40, () => {
      return this.fetcher.initNotes()
    })
  }

  public get Repository(): UsersRepository {
    return this.repository
  }

  public get Fetcher(): UsersFetcher {
    return this.fetcher
  }
}
