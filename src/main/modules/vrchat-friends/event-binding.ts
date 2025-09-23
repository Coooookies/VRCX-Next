import Nanobus from 'nanobus'
import { diffSurface } from '@main/utils/object'
import { parseLocation } from '../vrchat-worlds/location-parser'
import { toBaseFriendInformation } from './factory'
import { isSameLocation } from '../vrchat-worlds/utils'
import { UserStatus } from '@shared/definition/vrchat-api-response'
import { PipelineEvents } from '@shared/definition/vrchat-pipeline'
import type { LoggerFactory } from '@main/logger'
import type { VRChatUsers } from '../vrchat-users'
import type { VRChatPipeline } from '../vrchat-pipeline'
import type { FriendsRepository } from './repository'
import type { FriendsFetcher } from './fetcher'
import type { BaseFriendInformation, FriendInformation } from '@shared/definition/vrchat-friends'
import type {
  PipelineEventFriendActive,
  PipelineEventFriendAdd,
  PipelineEventFriendDelete,
  PipelineEventFriendLocation,
  PipelineEventFriendOffline,
  PipelineEventFriendOnline,
  PipelineEventFriendUpdate,
  PipelineEventMessage
} from '@shared/definition/vrchat-pipeline'

export class FriendsEventBinding extends Nanobus<{
  'friend:delete': (user: FriendInformation) => void
  'friend:add': (user: FriendInformation) => void
  'friend:online': (user: FriendInformation) => void
  'friend:offline': (user: FriendInformation) => void
  'friend:location': (user: FriendInformation) => void
  'friend:active': (user: FriendInformation) => void
  'friend:update': (user: FriendInformation, diff: Partial<BaseFriendInformation>) => void
}> {
  constructor(
    private readonly logger: LoggerFactory,
    private readonly pipeline: VRChatPipeline,
    private readonly repository: FriendsRepository,
    private readonly fetcher: FriendsFetcher,
    private readonly users: VRChatUsers
  ) {
    super('VRChatFriends:EventBinding')
  }

  private shieldedPipelineEvent = true

  public bindEvents() {
    this.pipeline.on('message', (message: PipelineEventMessage) => {
      if (this.shieldedPipelineEvent) {
        return
      }

      this.handlePipeMessage(message)
    })

    this.on('friend:active', (friend) => {
      this.logger.debug(
        'friend-active',
        friend.userId,
        friend.displayName,
        friend.status,
        friend.platform
      )
    })

    this.on('friend:offline', (friend) => {
      this.logger.debug('friend-offline', friend.userId, friend.displayName, friend.platform)
    })

    this.on('friend:online', (friend) => {
      this.logger.debug(
        'friend-online',
        friend.userId,
        friend.displayName,
        friend.location ? `${friend.location.worldName}(${friend.location.worldId})` : 'Private',
        friend.platform,
        JSON.stringify(friend, null, 2)
      )
    })

    this.on('friend:location', (friend) => {
      this.logger.debug(
        'friend-location',
        friend.userId,
        friend.displayName,
        friend.location ? `${friend.location.worldName}(${friend.location.worldId})` : 'Private',
        friend.isTraveling ? 'Traveling' : 'Not-Traveling'
      )
    })

    this.on('friend:add', (friend) => {
      this.logger.debug('friend-add', `${friend.displayName}(${friend.userId})`)
    })

    this.on('friend:delete', (friend) => {
      this.logger.debug('friend-delete', `${friend.displayName}(${friend.userId})`)
    })

    this.on('friend:update', (friend, diff) => {
      this.logger.debug(
        'friend-update',
        `${friend.displayName}(${friend.userId})`,
        JSON.stringify(diff)
      )
    })
  }

  public async startPipeProcessing(cachedPipelineEvents: PipelineEventMessage[]) {
    this.shieldedPipelineEvent = false
    this.logger.info(`Processing ${cachedPipelineEvents.length} cached pipeline events...`)

    for (const message of cachedPipelineEvents) {
      await this.handlePipeMessage(message)
    }
  }

  public stopPipeProcessing() {
    this.shieldedPipelineEvent = true
  }

  private async handlePipeMessage(message: PipelineEventMessage): Promise<void> {
    switch (message.type) {
      case PipelineEvents.FriendAdd: {
        await this.handleFriendAdd(message.content)
        break
      }
      case PipelineEvents.FriendDelete: {
        await this.handleFriendDelete(message.content)
        break
      }
      case PipelineEvents.FriendOnline: {
        await this.handleFriendOnline(message.content)
        break
      }
      case PipelineEvents.FriendOffline: {
        await this.handleFriendOffline(message.content)
        break
      }
      case PipelineEvents.FriendLocation: {
        await this.handleFriendLocation(message.content)
        break
      }
      case PipelineEvents.FriendActive: {
        await this.handleFriendActive(message.content)
        break
      }
      case PipelineEvents.FriendUpdate: {
        await this.handleFriendUpdate(message.content)
        break
      }
    }
  }

  private async handleFriendAdd({ user, userId }: PipelineEventFriendAdd): Promise<void> {
    const baseFriendInfo = toBaseFriendInformation(user)
    const location = await this.users.Fetcher.fetchUserLocation(userId)

    const isTraveling = location === 'traveling'
    const nextLocation = location ? parseLocation(location) : null
    const nextLocationArrivedAt = nextLocation ? new Date() : null

    const nextLocationSummary = nextLocation
      ? await this.users.Fetcher.enrichLocation(nextLocation)
      : null

    const friend: FriendInformation = {
      ...baseFriendInfo,
      isTraveling,
      location: nextLocationSummary,
      locationArrivedAt: nextLocationArrivedAt
    }

    this.repository.set(friend)
    this.emit('friend:add', friend)
  }

  private async handleFriendDelete({ userId }: PipelineEventFriendDelete): Promise<void> {
    const friend = this.repository.get(userId)

    if (friend) {
      this.emit('friend:delete', friend)
      this.repository.delete(userId)
    }
  }

  private async handleFriendOnline({
    userId,
    user,
    world,
    platform,
    location,
    travelingToLocation
  }: PipelineEventFriendOnline): Promise<void> {
    const friend = this.repository.get(userId)

    if (!friend) {
      return
    }

    const isTraveling = location === 'traveling'
    const travelingTarget = parseLocation(travelingToLocation)
    const originalTarget = parseLocation(location)
    const nextLocation = isTraveling ? travelingTarget : originalTarget
    const nextLocationSummary = nextLocation
      ? await this.fetcher.enrichLocation(nextLocation, world!)
      : null

    const updatedFriend: FriendInformation = {
      ...toBaseFriendInformation(user),
      location: nextLocationSummary,
      locationArrivedAt: nextLocation ? new Date() : null,
      platform,
      isTraveling
    }

    this.emit('friend:online', updatedFriend)
    this.repository.set(updatedFriend)
  }

  private async handleFriendOffline({
    userId,
    platform
  }: PipelineEventFriendOffline): Promise<void> {
    const friend = this.repository.get(userId)

    if (!friend) {
      return
    }

    const diff = {
      status: UserStatus.Offline,
      statusDescription: '',
      platform,
      location: null,
      locationArrivedAt: null,
      isTraveling: false
    }

    this.repository.update(userId, () => diff)
    this.emit('friend:offline', {
      ...friend,
      ...diff
    })
  }

  private async handleFriendLocation({
    userId,
    world,
    location,
    travelingToLocation
  }: PipelineEventFriendLocation): Promise<void> {
    const friend = this.repository.get(userId)

    if (!friend) {
      return
    }

    const isTraveling = location === 'traveling'
    const travelingTarget = parseLocation(travelingToLocation)
    const originalTarget = parseLocation(location)
    const prevLocation = friend.location
    const nextLocation = isTraveling ? travelingTarget : originalTarget
    const nextLocationArrivedAt = nextLocation ? new Date() : null
    const diff: Partial<FriendInformation> = {
      isTraveling
    }

    if (!isSameLocation(prevLocation, nextLocation)) {
      diff.locationArrivedAt = nextLocationArrivedAt
      diff.location = nextLocation ? await this.fetcher.enrichLocation(nextLocation, world!) : null
    }

    this.repository.update(userId, () => diff)
    this.emit('friend:location', {
      ...friend,
      ...diff
    })
  }

  private async handleFriendActive({
    user,
    userId,
    platform
  }: PipelineEventFriendActive): Promise<void> {
    const friend = this.repository.get(userId)

    if (!friend) {
      return
    }

    const diff = {
      status: user.status,
      statusDescription: user.statusDescription,
      platform,
      location: null,
      locationArrivedAt: null,
      isTraveling: false
    }

    this.repository.update(userId, () => diff)
    this.emit('friend:active', {
      ...friend,
      ...diff
    })
  }

  private async handleFriendUpdate({ user, userId }: PipelineEventFriendUpdate): Promise<void> {
    const friend = this.repository.get(userId)

    if (!friend) {
      return
    }

    const updatedFriend = toBaseFriendInformation(user)
    const diff = diffSurface<BaseFriendInformation>(friend, updatedFriend)

    diff.platform = updatedFriend.platform || friend.platform

    this.repository.update(userId, () => diff)
    this.emit(
      'friend:update',
      {
        ...friend,
        ...updatedFriend
      },
      diff
    )
  }
}
