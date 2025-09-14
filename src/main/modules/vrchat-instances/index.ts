import { createLogger } from '@main/logger'
import { Dependency, Module } from '@shared/module-constructor'
import { CurrentInstance } from './state-current-instance'
import { InstanceRepository } from './repository'
import { InstanceIPCBinding } from './ipc-binding'
import type { IPCModule } from '../ipc'
import type { VRChatLogWatcher } from '../vrchat-log-watcher'
import type { VRChatPipeline } from '../vrchat-pipeline'
import type { VRChatWorlds } from '../vrchat-worlds'
import type { VRChatGroups } from '../vrchat-groups'
import type { VRChatUsers } from '../vrchat-users'
import type { MobxState } from '../mobx-state'
import type { VRChatWorkflowCoordinator } from '../vrchat-workflow-coordinator'

export class VRChatInstances extends Module {
  @Dependency('MobxState') declare private mobx: MobxState
  @Dependency('IPCModule') declare private ipc: IPCModule
  @Dependency('VRChatLogWatcher') declare private logWatcher: VRChatLogWatcher
  @Dependency('VRChatPipeline') declare private pipeline: VRChatPipeline
  @Dependency('VRChatUsers') declare private users: VRChatUsers
  @Dependency('VRChatWorlds') declare private worlds: VRChatWorlds
  @Dependency('VRChatGroups') declare private groups: VRChatGroups
  @Dependency('VRChatWorkflowCoordinator') declare private workflow: VRChatWorkflowCoordinator

  private readonly logger = createLogger(this.moduleId)
  private repository!: InstanceRepository
  private instance!: CurrentInstance
  private ipcBinding!: InstanceIPCBinding

  protected onInit(): void {
    this.repository = new InstanceRepository(this.moduleId, this.mobx)
    this.instance = new CurrentInstance(
      this.logger,
      this.repository,
      this.logWatcher,
      this.users,
      this.worlds,
      this.groups
    )
    this.ipcBinding = new InstanceIPCBinding(this.ipc, this.repository)
    this.ipcBinding.bindInvokes()
    this.ipcBinding.bindEvents()
    this.instance.bindEvents()
    this.bindEvents()
  }

  private bindEvents(): void {
    this.workflow.registerPostLoginTask('instance-listener-mount', 60, async () => {
      await this.instance.start()
    })

    this.workflow.registerPostLogoutTask('instance-listener-unmount', 60, async () => {
      await this.instance.stop()
    })
  }
}
