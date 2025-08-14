import { createLogger } from '@main/logger'
import { Dependency, Module } from '@shared/module-constructor'
import type { VRChatAPI } from '../vrchat-api'
import type { VRChatAuthentication } from '../vrchat-authentication'
import type { VRChatWorkflowCoordinator } from '../vrchat-workflow-coordinator'

export class VRChatFriends extends Module<{}> {
  @Dependency('VRChatAPI') declare private api: VRChatAPI
  @Dependency('VRChatAuthentication') declare private auth: VRChatAuthentication
  @Dependency('VRChatWorkflowCoordinator') declare private workflow: VRChatWorkflowCoordinator

  private readonly logger = createLogger(this.moduleId)

  protected onInit(): void {
    this.bindEvents()
  }

  private bindEvents(): void {
    this.workflow.registerPostLoginTask('friends-resolver', 50, () => {
      this.logger.info('task')
    })
  }
}
