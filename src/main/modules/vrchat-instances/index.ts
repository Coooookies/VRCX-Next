import { createLogger } from '@main/logger'
import { parseLocation } from '../vrchat-worlds/location-parser'
import { Dependency, Module } from '@shared/module-constructor'
import { LogEvents } from '../vrchat-log-watcher/types'
import { PipelineEvents } from '@shared/definition/vrchat-pipeline'
import type { VRChatLogWatcher } from '../vrchat-log-watcher'
import type { VRChatPipeline } from '../vrchat-pipeline'
import type { LocationInstance } from '@shared/definition/vrchat-instances'

export class VRChatInstances extends Module {
  @Dependency('VRChatLogWatcher') declare private logWatcher: VRChatLogWatcher
  @Dependency('VRChatPipeline') declare private pipeline: VRChatPipeline

  private readonly logger = createLogger(this.moduleId)

  protected onInit(): void {
    this.listen()
  }

  private listen() {
    let isJoining = false
    let currentPlayerQueue: { userId: string; userName: string }[] = []
    let currentLocation: LocationInstance | null = null

    this.logWatcher.on('message', (data) => {
      switch (data.type) {
        case LogEvents.SelfJoin: {
          isJoining = true
          currentLocation = parseLocation(data.content.location)
          break
        }
        case LogEvents.SelfLeave: {
          currentPlayerQueue = []
          currentLocation = null
          isJoining = false
          break
        }
        case LogEvents.PlayerJoined: {
          if (isJoining) {
            currentPlayerQueue.push({
              userId: data.content.userId!,
              userName: data.content.userName!
            })
          }
          break
        }
      }
    })

    this.pipeline.on('message', (data) => {
      switch (data.type) {
        case PipelineEvents.UserLocation: {
          const location = parseLocation(data.content.location)
          if (isJoining && location?.worldId === currentLocation?.worldId) {
            isJoining = false
            this.logger.trace('Player queues:', currentPlayerQueue.length)
            currentPlayerQueue.forEach((player, index) => {
              this.logger.trace(`Queue player joined (${index}):`, JSON.stringify(player))
            })
          }
        }
      }
    })
  }
}
