import { toWorldEntity } from './factory'
import { PipelineEvents } from '@shared/definition/vrchat-pipeline'
import type { LoggerFactory } from '@main/logger'
import type { VRChatPipeline } from '../vrchat-pipeline'
import type { WorldRepository } from './repository'
import type {
  PipelineEventFriendLocation,
  PipelineEventFriendOnline,
  PipelineEventMessage
} from '@shared/definition/vrchat-pipeline'

export class WorldEventBinding {
  constructor(
    private readonly logger: LoggerFactory,
    private readonly pipeline: VRChatPipeline,
    private readonly repository: WorldRepository
  ) {
    this.bindEvents()
  }

  private bindEvents() {
    this.pipeline.on('message', (message: PipelineEventMessage) => {
      this.handlePipeMessage(message)
    })
  }

  private async handlePipeMessage(message: PipelineEventMessage): Promise<void> {
    switch (message.type) {
      case PipelineEvents.FriendOnline:
      case PipelineEvents.FriendLocation: {
        await this.processWorldFromPipeline(message.content)
        break
      }
    }
  }

  private async processWorldFromPipeline({
    worldId,
    world
  }: PipelineEventFriendLocation | PipelineEventFriendOnline): Promise<void> {
    if (world) {
      const entity = toWorldEntity(world)
      this.repository.saveEntities(entity)
      this.logger.info('Received world info from pipeline:', `${world.name}(${worldId})`)
    }
  }
}
