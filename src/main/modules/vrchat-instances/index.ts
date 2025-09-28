import { createLogger } from '@main/logger'
import { Dependency, Module } from '@shared/module-constructor'
import { CurrentInstance } from './state-current-instance'
import { InstanceFetcher } from './fetcher'
import { InstanceRepository } from './repository'
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
  private repository!: InstanceRepository
  private fetcher!: InstanceFetcher
  private instance!: CurrentInstance
  private ipcBinding!: InstanceIPCBinding

  protected onInit(): void {
    this.repository = new InstanceRepository(this.moduleId, this.mobx)
    this.fetcher = new InstanceFetcher(this.users)
    this.instance = new CurrentInstance(
      this.repository,
      this.fetcher,
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

    this.instance.on('instance:joined-complete', (_, location, world) => {
      this.logger.info(
        `Current-Instance Joined instance complete:`,
        location.location,
        `${world?.worldName || 'Unknown'}(${world?.worldId || 'Unknown'})`
      )
    })

    this.instance.on('instance:left', () => {
      this.logger.info('Current-Instance Left instance')
    })

    this.instance.on('instance:world-summary-initialized', (_, summary) => {
      this.logger.info(
        `Current-Instance World summary initialized:`,
        `${summary?.worldName || 'Unknown'}(${this.repository.State.currentInstance.locationInstance?.location})`
      )
    })

    this.instance.on('instance:present-loaded', (_, users) => {
      this.logger.info(
        'Current-Instance Users in instance:',
        users.map((user) => `${user.userName}(${user.userId})`).join(',')
      )
    })

    this.instance.on('user:joined', (_, user) => {
      this.logger.info('Current-Instance User joined:', `${user.userName}(${user.userId})`)
    })

    this.instance.on('user:left', (userId) => {
      this.logger.info('Current-Instance User left:', userId)
    })

    this.instance.on('video:playback-load', (url) => {
      this.logger.info('Current-Instance Video playback load:', url)
    })

    this.instance.on('video:playback-error', (message) => {
      this.logger.warn('Current-Instance Video playback error:', message)
    })

    this.instance.on('moderation:vote-kick', (userName) => {
      this.logger.info('Current-Instance Vote kick:', userName)
    })
  }
}
