import Nanobus from 'nanobus'
import { toJS } from 'mobx'
import { isSameLocation } from '../vrchat-worlds/utils'
import { toCurrentUserInformation } from './factory'
import { diffSurface } from '@main/utils/object'
import { parseLocation } from '../vrchat-worlds/location-parser'
import { PipelineEvents } from '@shared/definition/vrchat-pipeline'
import type { VRChatPipeline } from '../vrchat-pipeline'
import type { LoggerFactory } from '@main/logger'
import type { LocationInstanceSummary } from '@shared/definition/vrchat-instances'
import type {
  PipelineEventMessage,
  PipelineEventUserLocation,
  PipelineEventUserUpdate
} from '@shared/definition/vrchat-pipeline'
import type { CurrentUserInformation, UserLocation } from '@shared/definition/vrchat-users'
import type { UsersRepository } from './repository'
import type { UsersFetcher } from './fetcher'

export class UsersEventBinding extends Nanobus<{
  'user:update': (user: CurrentUserInformation, diff: Partial<CurrentUserInformation>) => void
  'user:location': (location: UserLocation) => void
}> {
  constructor(
    private readonly logger: LoggerFactory,
    private readonly repository: UsersRepository,
    private readonly pipeline: VRChatPipeline,
    private readonly fetcher: UsersFetcher
  ) {
    super('VRChatFriends:EventBinding')
  }

  public bindEvents() {
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
      nextLocationSummary = nextLocation ? await this.fetcher.enrichLocation(nextLocation) : null
    }

    const newLocation = {
      isTraveling,
      location: nextLocationSummary,
      locationArrivedAt: nextLocationArrivedAt
    }

    this.emit('user:location', newLocation)
    this.logger.info(`User location updated: from ${location}, toLocation: ${travelingToLocation}`)
    this.repository.setLocationState(newLocation)
  }

  private async handleUserUpdate({ user }: PipelineEventUserUpdate): Promise<void> {
    const oldUser = toJS(this.repository.State.user)
    const newUser = toCurrentUserInformation(user)
    const diff = oldUser ? diffSurface<CurrentUserInformation>(oldUser, newUser) : newUser

    this.emit('user:update', newUser, diff)
    this.logger.info(`User updated: ${user.id}`, diff)
    this.repository.setUserState(newUser)
  }
}
