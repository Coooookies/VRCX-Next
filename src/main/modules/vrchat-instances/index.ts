import { createLogger } from '@main/logger'
import { Dependency, Module } from '@shared/module-constructor'
import type { VRChatLogWatcher } from '../vrchat-log-watcher'
import type { VRChatPipeline } from '../vrchat-pipeline'
import type { VRChatWorlds } from '../vrchat-worlds'
import type { VRChatUsers } from '../vrchat-users'
import { CurrentInstance } from './state-current-instance'

export class VRChatInstances extends Module {
  @Dependency('VRChatLogWatcher') declare private logWatcher: VRChatLogWatcher
  @Dependency('VRChatPipeline') declare private pipeline: VRChatPipeline
  @Dependency('VRChatUsers') declare private users: VRChatUsers
  @Dependency('VRChatWorlds') declare private worlds: VRChatWorlds

  private readonly logger = createLogger(this.moduleId)
  private currentinstance!: CurrentInstance

  protected onInit(): void {
    this.currentinstance = new CurrentInstance(this.logWatcher, this.users, this.worlds)
  }
}
