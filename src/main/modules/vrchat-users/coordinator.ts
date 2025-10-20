import { toCurrentUserInformation, toUserEntity } from './factory'
import { PipelineEvents } from '@shared/definition/vrchat-pipeline'
import type { CurrentUserStore } from './current-user-store'
import type { VRChatPipeline } from '../vrchat-pipeline'
import type { LoggerFactory } from '@main/logger'
import type { UsersRepository } from './repository'
import type {
  PipelineEventFriendAdd,
  PipelineEventFriendOnline,
  PipelineEventFriendUpdate,
  PipelineEventMessage,
  PipelineEventUserLocation,
  PipelineEventUserUpdate
} from '@shared/definition/vrchat-pipeline'

export class UsersCoordinator {
  constructor(
    private readonly logger: LoggerFactory,
    private readonly repository: UsersRepository,
    private readonly pipeline: VRChatPipeline,
    private readonly currentUser: CurrentUserStore
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
      case PipelineEvents.UserUpdate: {
        await this.handleUserUpdate(message.content)
        break
      }
      case PipelineEvents.UserLocation: {
        await this.handleUserLocation(message.content)
        break
      }
      case PipelineEvents.FriendAdd: {
        await this.handleFriendAdd(message.content)
        break
      }
      case PipelineEvents.FriendOnline: {
        await this.handleFriendOnline(message.content)
        break
      }
      case PipelineEvents.FriendUpdate: {
        await this.handleFriendUpdate(message.content)
        break
      }
    }
  }

  private async handleUserLocation({
    location,
    travelingToLocation
  }: PipelineEventUserLocation): Promise<void> {
    this.currentUser.updateLocation(location, travelingToLocation)
  }

  private async handleUserUpdate({ user }: PipelineEventUserUpdate): Promise<void> {
    this.currentUser.updateUser(toCurrentUserInformation(user))
  }

  private async handleFriendAdd({ user }: PipelineEventFriendAdd): Promise<void> {
    const entity = toUserEntity(user)
    this.repository.saveUserEntities(entity)
    this.logger.info('Received user info from pipeline:', `${user.displayName}(${user.id})`)
  }

  private async handleFriendOnline({ user }: PipelineEventFriendOnline): Promise<void> {
    const entity = toUserEntity(user)
    this.repository.saveUserEntities(entity)
    this.logger.info('Received user info from pipeline:', `${user.displayName}(${user.id})`)
  }

  private async handleFriendUpdate({ user }: PipelineEventFriendUpdate): Promise<void> {
    const entity = toUserEntity(user)
    this.repository.saveUserEntities(entity)
    this.logger.info('Received user info from pipeline:', `${user.displayName}(${user.id})`)
  }
}
