import { diffObjects } from '@main/utils/object'
import { parseLocation } from '../vrchat-worlds/location-parser'
import { toBaseFriendInformation } from './factory'
import { isSameLocation } from '../vrchat-worlds/utils'
import { FRIEND_UPDATE_COMPARE_KEYS } from './constants'
import { Platform, UserStatus } from '@shared/definition/vrchat-api-response'
import { PipelineEvents } from '@shared/definition/vrchat-pipeline'
import type { LoggerFactory } from '@main/logger'
import type { VRChatFriends } from '.'
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

export class FriendsEventBinding {
  constructor(
    private readonly parent: VRChatFriends,
    private readonly logger: LoggerFactory,
    private readonly pipeline: VRChatPipeline,
    private readonly repository: FriendsRepository,
    private readonly fetcher: FriendsFetcher,
    private readonly users: VRChatUsers
  ) {
    this.bindEvents()
  }

  private shieldedPipelineEvent = true

  private bindEvents() {
    this.pipeline.on('message', (message: PipelineEventMessage) => {
      if (this.shieldedPipelineEvent) {
        return
      }

      this.handlePipeMessage(message)
    })

    this.users.on('friends:state-update', async (state) => {
      this.repository.setFriendUserIds(state.all)
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
    const location = await this.users.fetchUserLocation(userId)

    const order = this.repository.friendCount
    const isTraveling = location === 'traveling'
    const isOffline = location === 'offline'
    const nextLocation = location ? parseLocation(location) : null
    const nextLocationArrivedAt = nextLocation ? new Date() : null

    const nextLocationSummary = nextLocation
      ? await this.users.enrichLocationInstance(nextLocation)
      : null

    const information: FriendInformation = {
      ...baseFriendInfo,
      order,
      status: isOffline ? UserStatus.Offline : user.status,
      isTraveling,
      location: nextLocationSummary,
      locationArrivedAt: nextLocationArrivedAt
    }

    this.repository.set(information)
    this.parent.emit('friend:add', information)
  }

  private async handleFriendDelete({ userId }: PipelineEventFriendDelete): Promise<void> {
    const friend = this.repository.get(userId)

    if (friend) {
      this.parent.emit('friend:delete', friend)
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
    const updatedFriend = toBaseFriendInformation(user)

    if (!friend) {
      return
    }

    const { diff: friendDiff, keys: friendUpdatedKeys } = diffObjects<BaseFriendInformation>(
      friend,
      updatedFriend,
      FRIEND_UPDATE_COMPARE_KEYS
    )

    const isTraveling = location === 'traveling'
    const travelingTarget = parseLocation(travelingToLocation)
    const originalTarget = parseLocation(location)
    const nextLocation = isTraveling ? travelingTarget : originalTarget
    const nextLocationSummary = nextLocation
      ? await this.fetcher.enrichLocation(nextLocation, world!)
      : null

    const newDiff: Partial<FriendInformation> = {
      ...friendDiff.after,
      platform,
      status: user.status,
      statusDescription: user.statusDescription,
      location: nextLocationSummary,
      locationArrivedAt: nextLocation ? new Date() : null,
      isTraveling
    }

    this.repository.update(userId, () => newDiff)
    this.parent.emit('friend:online', {
      ...friend,
      ...newDiff
    })

    if (friendUpdatedKeys.length > 0) {
      this.parent.emit(
        'friend:update',
        {
          ...friend,
          ...updatedFriend
        },
        {
          before: { ...friendDiff.before },
          after: { ...friendDiff.after }
        },
        friendUpdatedKeys
      )
    }
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
    this.parent.emit('friend:offline', {
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
    this.parent.emit('friend:location', {
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
    this.parent.emit('friend:active', {
      ...friend,
      ...diff
    })
  }

  private async handleFriendUpdate({ user, userId }: PipelineEventFriendUpdate): Promise<void> {
    const friend = this.repository.get(userId)
    const updatedFriend = toBaseFriendInformation(user)

    if (!friend) {
      return
    }

    const { diff: friendDiff, keys: friendUpdatedKeys } = diffObjects<BaseFriendInformation>(
      friend,
      updatedFriend,
      FRIEND_UPDATE_COMPARE_KEYS
    )

    if (friendUpdatedKeys.includes('platform') && friendDiff.after.platform === Platform.Unknown) {
      delete friendDiff.before.platform
      delete friendDiff.after.platform
    }

    this.repository.update(userId, () => friendDiff.after)
    this.parent.emit(
      'friend:update',
      {
        ...friend,
        ...updatedFriend
      },
      {
        before: { ...friendDiff.before },
        after: { ...friendDiff.after }
      },
      friendUpdatedKeys
    )
  }
}
