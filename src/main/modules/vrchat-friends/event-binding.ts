import Nanobus from 'nanobus'
import { diffSurface } from '@main/utils/object'
import { parseLocation } from '../vrchat-worlds/location-parser'
import { toBaseFriendInformation } from './factory'
import { toUserEntity } from '../vrchat-users/factory'
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
  'friend:delete': (friend: FriendInformation) => void
  'friend:add': (friend: FriendInformation) => void
  'friend:online': (friend: FriendInformation) => void
  'friend:offline': (friend: FriendInformation) => void
  'friend:location': (friend: FriendInformation) => void
  'friend:active': (friend: FriendInformation) => void
  'friend:update': (friend: FriendInformation, diff: Partial<BaseFriendInformation>) => void
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
    const updateUserNote = (userId: string, note?: string) => {
      const friend = this.repository.get(userId)
      if (friend) {
        this.repository.set({
          ...friend,
          note: note || null
        })
      }
    }

    this.pipeline.on('message', (message: PipelineEventMessage) => {
      if (this.shieldedPipelineEvent) {
        return
      }

      this.handlePipeMessage(message)
    })

    this.users.Repository.on('notes:update', (notes) => {
      if (this.shieldedPipelineEvent) {
        return
      }

      for (const note of notes) {
        updateUserNote(note.userId, note.note)
      }
    })

    this.users.Repository.on('notes:delete', (userId) => {
      if (this.shieldedPipelineEvent) {
        return
      }

      updateUserNote(userId)
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

  private async handleFriendAdd({ user }: PipelineEventFriendAdd): Promise<void> {
    const friend: FriendInformation = {
      ...toBaseFriendInformation(user),
      isTraveling: false,
      location: null,
      locationArrivedAt: null
    }

    this.repository.set(friend)
    this.emit('friend:add', friend)

    await this.users.Repository.saveUserEntities(toUserEntity(user))
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

    this.repository.set(updatedFriend)
    this.emit('friend:online', updatedFriend)
  }

  private async handleFriendOffline({
    userId,
    platform
  }: PipelineEventFriendOffline): Promise<void> {
    const friend = this.repository.get(userId)

    if (!friend) {
      return
    }

    const newFriend = {
      ...friend
    }

    newFriend.location = null
    newFriend.locationArrivedAt = null
    newFriend.isTraveling = false
    newFriend.status = UserStatus.Offline
    newFriend.statusDescription = ''
    newFriend.platform = platform

    this.repository.set(newFriend)
    this.emit('friend:offline', newFriend)
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

    const newFriend = {
      ...friend
    }

    friend.status = user.status
    friend.statusDescription = user.statusDescription
    friend.platform = platform
    friend.location = null
    friend.locationArrivedAt = null
    friend.isTraveling = false

    this.emit('friend:active', friend)
    this.repository.set(newFriend)
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

    await this.users.Repository.saveUserEntities(toUserEntity(user))
  }
}
