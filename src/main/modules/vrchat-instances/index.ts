import { createLogger } from '@main/logger'
import { Dependency, Module } from '@shared/module-constructor'
import { InstanceTracker } from './instance-tracker'
import { InstanceIPCBinding } from './ipc-binding'
import type { IPCModule } from '../ipc'
import type { ServiceMonitor } from '../service-monitor'
import type { VRChatAuthentication } from '../vrchat-authentication'
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
  @Dependency('ServiceMonitor') declare private monitor: ServiceMonitor
  @Dependency('VRChatAuthentication') declare private auth: VRChatAuthentication
  @Dependency('VRChatLogWatcher') declare private logWatcher: VRChatLogWatcher
  @Dependency('VRChatPipeline') declare private pipeline: VRChatPipeline
  @Dependency('VRChatUsers') declare private users: VRChatUsers
  @Dependency('VRChatWorlds') declare private worlds: VRChatWorlds
  @Dependency('VRChatGroups') declare private groups: VRChatGroups
  @Dependency('VRChatWorkflowCoordinator') declare private workflow: VRChatWorkflowCoordinator

  private readonly logger = createLogger(this.moduleId)
  private instance!: InstanceTracker
  private ipcBinding!: InstanceIPCBinding

  protected onInit(): void {
    this.instance = new InstanceTracker(
      this.logWatcher,
      this.mobx,
      this.users,
      this.worlds,
      this.groups
    )
    this.ipcBinding = new InstanceIPCBinding(this.ipc, this.instance)
    this.ipcBinding.bindInvokes()
    this.ipcBinding.bindEvents()
    this.bindEvents()
  }

  private bindEvents(): void {
    this.workflow.registerPostLoginTask('instance-listener-mount', 60, async () => {
      // manually refresh
      if (!this.monitor.Repository.vrchatState.isRunning) {
        await this.monitor.refresh()
      }

      if (this.monitor.Repository.vrchatState.isRunning) {
        await this.instance.start()
      }
    })

    this.workflow.registerPostLogoutTask('instance-listener-unmount', 60, async () => {
      await this.instance.stop()
    })

    this.monitor.on('process:vrchat:state-change', (isRunning) => {
      if (this.auth.isLoggedIn && isRunning) {
        this.instance.start(true)
      } else {
        this.instance.stop()
      }
    })

    this.instance.on('instance:joined', (_, location) => {
      this.logger.info(`Current-Instance Joined instance:`, location.location)
    })

    this.instance.on('instance:initialization-complete', (_, world) => {
      this.logger.info(
        `Current-Instance initialization completed:`,
        `${world?.worldName || 'Unknown'}(${world?.worldId || 'Unknown'})`
      )
    })

    this.instance.on('instance:left', () => {
      this.logger.info('Current-Instance Left instance')
    })

    this.instance.on('instance:player-joined', (_, users) => {
      users.forEach((user) => {
        this.logger.info('Current-Instance User joined:', `${user.userName}(${user.userId})`)
      })
    })

    this.instance.on('instance:player-left', (_, userId) => {
      this.logger.info('Current-Instance User left:', userId)
    })

    this.instance.on('instance:event', (_, events) => {
      events.forEach((event) => {
        this.logger.info('Current-Instance Event:', event.type, JSON.stringify(event.content))
      })
    })
  }
}
