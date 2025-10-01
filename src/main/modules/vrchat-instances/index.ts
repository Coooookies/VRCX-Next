import { createLogger } from '@main/logger'
import { Dependency, Module } from '@shared/module-constructor'
import { InstanceTracker } from './instance-tracker'
import { InstanceIPCBinding } from './ipc-binding'
import { InstanceEventBinding } from './event-binding'
import { InstanceRepository } from './repository'
import type { IPCModule } from '../ipc'
import type { VRChatAuthentication } from '../vrchat-authentication'
import type { VRChatGameProcess } from '../vrchat-game-process'
import type { VRChatPipeline } from '../vrchat-pipeline'
import type { VRChatWorlds } from '../vrchat-worlds'
import type { VRChatGroups } from '../vrchat-groups'
import type { VRChatUsers } from '../vrchat-users'
import type { VRChatWorkflowCoordinator } from '../vrchat-workflow-coordinator'
import type { MobxState } from '../mobx-state'
import type { Database } from '../database'

export class VRChatInstances extends Module {
  @Dependency('MobxState') declare private mobx: MobxState
  @Dependency('IPCModule') declare private ipc: IPCModule
  @Dependency('VRChatAuthentication') declare private auth: VRChatAuthentication
  @Dependency('VRChatGameProcess') declare private gameProcess: VRChatGameProcess
  @Dependency('VRChatPipeline') declare private pipeline: VRChatPipeline
  @Dependency('VRChatUsers') declare private users: VRChatUsers
  @Dependency('VRChatWorlds') declare private worlds: VRChatWorlds
  @Dependency('VRChatGroups') declare private groups: VRChatGroups
  @Dependency('VRChatWorkflowCoordinator') declare private workflow: VRChatWorkflowCoordinator
  @Dependency('Database') declare private database: Database

  private readonly logger = createLogger(this.moduleId)
  private repository!: InstanceRepository
  private instance!: InstanceTracker
  private ipcBinding!: InstanceIPCBinding
  private eventBinding!: InstanceEventBinding

  protected onInit(): void {
    this.repository = new InstanceRepository(this.database)
    this.instance = new InstanceTracker(
      this.gameProcess,
      this.mobx,
      this.users,
      this.worlds,
      this.groups
    )
    this.ipcBinding = new InstanceIPCBinding(this.ipc, this.instance)
    this.eventBinding = new InstanceEventBinding(this.repository, this.instance)
    this.bindEvents()

    // unused protect
    void this.ipcBinding
    void this.eventBinding
  }

  private bindEvents(): void {
    this.workflow.registerPostLoginTask('instance-listener-mount', 60, async () => {
      const loggedInUserId = this.users.activeUser?.userId
      const gameProcessUserId = this.gameProcess.currentUser?.userId

      // if the user is already logged in the game process
      if (loggedInUserId && gameProcessUserId === loggedInUserId) {
        await this.instance.loginAs(gameProcessUserId)
      }
    })

    this.workflow.registerPostLogoutTask('instance-listener-unmount', 60, async () => {
      await this.instance.logout()
    })

    this.gameProcess.on('game:user-authenticated', (userId) => {
      const loggedInUserId = this.users.activeUser?.userId
      const isLoggedIn = this.auth.isLoggedIn

      if (isLoggedIn && userId === loggedInUserId) {
        this.instance.loginAs(userId)
      }
    })

    this.gameProcess.on('game:user-logged-out', (exitWithGame) => {
      this.instance.logout(exitWithGame)
    })

    // Debug logs

    this.instance.on('instance:joined', (_, location) => {
      this.logger.info(`Current-Instance Joined instance:`, location.location)
    })

    this.instance.on('instance:initialization-complete', (_, __, world) => {
      this.logger.info(
        `Current-Instance initialization completed:`,
        `${world?.worldName || 'Unknown'}(${world?.worldId || 'Unknown'})`
      )
    })

    this.instance.on('instance:left', () => {
      this.logger.info('Current-Instance Left instance')
    })

    this.instance.on('instance:event', (_, events) => {
      events.forEach((event) => {
        this.logger.info('Current-Instance Event:', event.type, JSON.stringify(event.content))
      })
    })
  }
}
