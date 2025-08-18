import Nanobus from 'nanobus'
import { diffSurface } from '@main/utils/object'
import { parseLocation } from '../vrchat-worlds/parser'
import { parseFileUrl } from '../vrchat-files/parser'
import { toBaseFriendInformation } from './factory'
import { isGroupInstance } from '../vrchat-worlds/factory'
import { UserStatus } from '@shared/definition/vrchat-api-response'
import { PipelineEvents } from '@shared/definition/vrchat-pipeline'
import type { LoggerFactory } from '@main/logger'
import type { VRChatGroups } from '../vrchat-groups'
import type { VRChatUsers } from '../vrchat-users'
import type { VRChatPipeline } from '../vrchat-pipeline'
import type { FriendRepository } from './repository'
import type { BaseFriendInformation, FriendInformation } from '@shared/definition/vrchat-friends'
import type { LocationInstance, LocationInstanceGroup } from '@shared/definition/vrchat-instances'
import type { World } from '@shared/definition/vrchat-api-response'
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

export class FriendEventBinding extends Nanobus<{
  'friend:delete': (friendUserId: string) => void
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
    private readonly repository: FriendRepository,
    private readonly groups: VRChatGroups,
    private readonly users: VRChatUsers
  ) {
    super('VRChatFriends:EventBinding')
    this.bindEvents()
  }

  private shieldedPipelineEvent = true

  public async startPipeProcessing(cachedPipelineEvents: PipelineEventMessage[]) {
    this.shieldedPipelineEvent = false
    for (const message of cachedPipelineEvents) {
      await this.handlePipeMessage(message)
    }
  }

  public stopPipeProcessing() {
    this.shieldedPipelineEvent = true
  }

  private bindEvents() {
    const updateUserNote = (userId: string, note: string) => {
      const friend = this.repository.get(userId)
      if (friend) {
        friend.note = note
        this.emit('friend:update', friend, { note })
        this.logger.debug('note:update', JSON.stringify(friend, null, 2))
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

      updateUserNote(userId, '')
    })
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
    this.logger.debug('add', JSON.stringify(friend, null, 2))
    this.emit('friend:add', friend)
  }

  private async handleFriendDelete({ userId }: PipelineEventFriendDelete): Promise<void> {
    const friend = this.repository.get(userId)

    if (friend) {
      this.logger.debug('delete', JSON.stringify(friend, null, 2))
    }

    this.repository.delete(userId)
    this.emit('friend:delete', userId)
  }

  private async handleFriendOnline({
    userId,
    user,
    world,
    platform,
    location
  }: PipelineEventFriendOnline): Promise<void> {
    const friend = this.repository.get(userId)

    if (!friend) {
      return
    }

    const nextLocation = parseLocation(location)
    const isSameLocation = this.isSameLocation(friend.location, nextLocation)

    if (nextLocation && world) {
      await this.enrichLocationWithWorldInfo(nextLocation, world)
    }

    if (!isSameLocation) {
      friend.locationArrivedAt = nextLocation ? new Date() : null
    }

    friend.location = nextLocation
    friend.isTraveling = false
    friend.status = user.status
    friend.statusDescription = user.statusDescription
    friend.platform = platform

    this.logger.debug('online', JSON.stringify(friend, null, 2))
    this.emit('friend:online', friend)
  }

  private async handleFriendOffline({
    userId,
    platform
  }: PipelineEventFriendOffline): Promise<void> {
    const friend = this.repository.get(userId)

    if (!friend) {
      return
    }

    friend.location = null
    friend.locationArrivedAt = null
    friend.isTraveling = false
    friend.status = UserStatus.Offline
    friend.statusDescription = ''
    friend.platform = platform

    this.logger.debug('offline', JSON.stringify(friend, null, 2))
    this.emit('friend:offline', friend)
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

    const nextLocation = isTraveling ? travelingTarget : originalTarget
    const isSameLocation = this.isSameLocation(friend.location, nextLocation)

    if (nextLocation && world) {
      this.enrichLocationWithWorldInfo(nextLocation, world)

      if (isGroupInstance(nextLocation)) {
        await this.enrichLocationWithGroupInfo(nextLocation as LocationInstanceGroup)
      }
    }

    if (!isSameLocation) {
      friend.locationArrivedAt = nextLocation ? new Date() : null
    }

    friend.location = nextLocation
    friend.isTraveling = isTraveling

    this.logger.debug('location', JSON.stringify(friend, null, 2))
    this.emit('friend:location', friend)
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

    if (friend.status === UserStatus.Offline) {
      friend.location = null
      friend.locationArrivedAt = null
      friend.isTraveling = false
      friend.status = user.status
      friend.statusDescription = user.statusDescription
      friend.platform = platform
    }

    this.logger.debug('active', JSON.stringify(friend, null, 2))
    this.emit('friend:active', friend)
  }

  private async handleFriendUpdate({ user, userId }: PipelineEventFriendUpdate): Promise<void> {
    const friend = this.repository.get(userId)

    if (!friend) {
      return
    }

    const updatedFriend = toBaseFriendInformation(user)
    const diff = diffSurface<BaseFriendInformation>(friend, updatedFriend)
    const result = {
      ...friend,
      ...updatedFriend
    }

    this.repository.set(result)
    this.logger.debug('update', JSON.stringify(diff, null, 2), JSON.stringify(result, null, 2))
    this.emit('friend:update', result, diff)
  }

  private isSameLocation(
    currentLocation: LocationInstance | null,
    nextLocation: LocationInstance | null
  ): boolean {
    return (
      !!currentLocation &&
      !!nextLocation &&
      nextLocation.worldId === currentLocation.worldId &&
      nextLocation.name === currentLocation.name
    )
  }

  private enrichLocationWithWorldInfo(location: LocationInstance, world: World): void {
    const worldImageInfo = parseFileUrl(world.imageUrl)
    location.worldName = world.name
    location.worldImageFileId = worldImageInfo.fileId
    location.worldImageFileVersion = worldImageInfo.version
  }

  private async enrichLocationWithGroupInfo(groupLocation: LocationInstanceGroup): Promise<void> {
    const group = await this.groups.Fetcher.fetchGroupEntities(groupLocation.groupId)
    if (group) {
      groupLocation.groupName = group.groupName
      groupLocation.groupImageFileId = group.iconFileId
      groupLocation.groupImageFileVersion = group.iconFileVersion
    }
  }
}
