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
    location,
    travelingToLocation
  }: PipelineEventFriendOnline): Promise<void> {
    const friend = this.repository.get(userId)

    if (!friend) {
      return
    }

    const newFriend = {
      ...friend
    }

    const isTraveling = location === 'traveling'
    const travelingTarget = parseLocation(travelingToLocation)
    const originalTarget = parseLocation(location)
    const nextLocation = isTraveling ? travelingTarget : originalTarget

    if (nextLocation && world) {
      await this.enrichLocationWithWorldInfo(nextLocation, world)
    }

    newFriend.isTraveling = false
    newFriend.status = user.status
    newFriend.statusDescription = user.statusDescription
    newFriend.platform = platform
    newFriend.location = nextLocation
    newFriend.locationArrivedAt = nextLocation ? new Date() : null

    this.repository.set(newFriend)
    this.logger.debug('online', JSON.stringify(newFriend, null, 2))
    this.emit('friend:online', newFriend)
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
    this.logger.debug('offline', JSON.stringify(newFriend, null, 2))
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

    const newFriend = {
      ...friend
    }

    const isTraveling = location === 'traveling'
    const travelingTarget = parseLocation(travelingToLocation)
    const originalTarget = parseLocation(location)

    const nextLocation = isTraveling ? travelingTarget : originalTarget
    const isSameLocation = this.isSameLocation(newFriend.location, nextLocation)

    if (nextLocation && world) {
      this.enrichLocationWithWorldInfo(nextLocation, world)

      if (isGroupInstance(nextLocation)) {
        await this.enrichLocationWithGroupInfo(nextLocation as LocationInstanceGroup)
      }
    }

    if (!isSameLocation) {
      newFriend.locationArrivedAt = nextLocation ? new Date() : null
    }

    newFriend.location = nextLocation
    newFriend.isTraveling = isTraveling

    this.repository.set(newFriend)
    this.logger.debug('location', JSON.stringify(newFriend, null, 2))
    this.emit('friend:location', newFriend)
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

    if (newFriend.status === UserStatus.Offline) {
      newFriend.location = null
      newFriend.locationArrivedAt = null
      newFriend.isTraveling = false
      newFriend.status = user.status
      newFriend.statusDescription = user.statusDescription
      newFriend.platform = platform
    }

    this.repository.set(newFriend)
    this.logger.debug('active', JSON.stringify(newFriend, null, 2))
    this.emit('friend:active', newFriend)
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
