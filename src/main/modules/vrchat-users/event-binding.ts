import { toJS } from 'mobx'
import { isSameLocation } from '../vrchat-worlds/utils'
import { toCurrentUserInformation, toUserEntity } from './factory'
import { parseLocation } from '../vrchat-worlds/location-parser'
import { diffObjects } from '@main/utils/object'
import { USER_UPDATE_COMPARE_KEYS } from './constants'
import { PipelineEvents } from '@shared/definition/vrchat-pipeline'
import type { VRChatUsers } from '.'
import type { VRChatPipeline } from '../vrchat-pipeline'
import type { LoggerFactory } from '@main/logger'
import type { LocationInstanceSummary } from '@shared/definition/vrchat-instances'
import type {
  PipelineEventFriendAdd,
  PipelineEventFriendOnline,
  PipelineEventFriendUpdate,
  PipelineEventMessage,
  PipelineEventUserLocation,
  PipelineEventUserUpdate
} from '@shared/definition/vrchat-pipeline'
import type { CurrentUserInformation } from '@shared/definition/vrchat-users'
import type { UsersRepository } from './repository'
import type { UsersFetcher } from './fetcher'

export class UsersEventBinding {
  constructor(
    private readonly parent: VRChatUsers,
    private readonly logger: LoggerFactory,
    private readonly repository: UsersRepository,
    private readonly pipeline: VRChatPipeline,
    private readonly fetcher: UsersFetcher
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
    const isTraveling = location === 'traveling:traveling'
    const isOffline = location === 'offline:offline' || travelingToLocation === 'offline'

    if (isOffline) {
      return this.repository.setLocationState(null)
    }

    const originalTarget = parseLocation(location)
    const travelingTarget = parseLocation(travelingToLocation)
    const nextLocation = isTraveling ? travelingTarget : originalTarget
    const prevLocation = this.repository.State.location?.location || null

    let nextLocationSummary: LocationInstanceSummary | null
    let nextLocationArrivedAt: Date | null

    if (isSameLocation(prevLocation, nextLocation)) {
      nextLocationArrivedAt = this.repository.State.location?.locationArrivedAt || null
      nextLocationSummary = prevLocation || null
    } else {
      nextLocationArrivedAt = nextLocation ? new Date() : null
      nextLocationSummary = nextLocation
        ? await this.fetcher.enrichLocationInstance(nextLocation)
        : null
    }

    const newLocation = {
      isTraveling,
      location: nextLocationSummary,
      locationArrivedAt: nextLocationArrivedAt
    }

    this.repository.setLocationState(newLocation)
    this.parent.emit('user:location', newLocation)
  }

  private async handleUserUpdate({ user }: PipelineEventUserUpdate): Promise<void> {
    if (!this.repository.State.user) {
      return
    }

    const baseUser = toJS(this.repository.State.user)
    const updatedUser = toCurrentUserInformation(user)

    const { diff: userDiff, keys: userUpdatedKeys } = diffObjects<CurrentUserInformation>(
      baseUser,
      updatedUser,
      USER_UPDATE_COMPARE_KEYS
    )

    this.repository.setUserState(updatedUser)
    this.parent.emit(
      'user:update',
      {
        before: { ...userDiff.before },
        after: { ...userDiff.after }
      },
      userUpdatedKeys
    )
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
