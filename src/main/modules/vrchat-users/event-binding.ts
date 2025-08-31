import Nanobus from 'nanobus'
import { toJS } from 'mobx'
import { isGroupInstance } from '../vrchat-worlds/factory'
import { toCurrentUserInformation } from './factory'
import { diffSurface } from '@main/utils/object'
import { parseLocation } from '../vrchat-worlds/location-parser'
import { PipelineEvents } from '@shared/definition/vrchat-pipeline'
import type { LoggerFactory } from '@main/logger'
import type { VRChatGroups } from '../vrchat-groups'
import type { VRChatWorlds } from '../vrchat-worlds'
import type { VRChatPipeline } from '../vrchat-pipeline'
import type { LocationInstance, LocationInstanceGroup } from '@shared/definition/vrchat-instances'
import type {
  PipelineEventMessage,
  PipelineEventUserLocation,
  PipelineEventUserUpdate
} from '@shared/definition/vrchat-pipeline'
import type { CurrentUserInformation, UserLocation } from '@shared/definition/vrchat-users'
import type { UsersRepository } from './repository'

export class UsersEventBinding extends Nanobus<{
  'user:update': (user: CurrentUserInformation, diff: Partial<CurrentUserInformation>) => void
  'user:location': (location: UserLocation) => void
}> {
  constructor(
    private readonly logger: LoggerFactory,
    private readonly repository: UsersRepository,
    private readonly pipeline: VRChatPipeline,
    private readonly worlds: VRChatWorlds,
    private readonly groups: VRChatGroups
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
    const isSameLocation = this.isSameLocation(prevLocation, nextLocation)

    if (nextLocation) {
      await this.enrichLocationWithWorldInfo(nextLocation)

      if (isGroupInstance(nextLocation)) {
        await this.enrichLocationWithGroupInfo(nextLocation as LocationInstanceGroup)
      }
    }

    const locationArrivedAt = isSameLocation
      ? this.repository.State.location?.locationArrivedAt || null
      : nextLocation
        ? new Date()
        : null

    const newLocation = {
      isTraveling,
      location: nextLocation,
      locationArrivedAt
    }

    this.logger.info(
      `User location updated, location: ${location}, travelingToLocation: ${travelingToLocation}`
    )

    this.emit('user:location', newLocation)
    this.repository.setLocationState(newLocation)
  }

  private async handleUserUpdate({ user }: PipelineEventUserUpdate): Promise<void> {
    const oldUser = toJS(this.repository.State.user)
    const newUser = toCurrentUserInformation(user)
    const diff = oldUser ? diffSurface<CurrentUserInformation>(oldUser, newUser) : newUser

    this.logger.info(`User updated: ${user.id}`, diff)
    this.emit('user:update', newUser, diff)
    this.repository.setUserState(newUser)
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

  private async enrichLocationWithWorldInfo(location: LocationInstance) {
    const world = await this.worlds.Fetcher.fetchWorldEntities(location.worldId)

    if (world) {
      location.worldName = world.worldName
      location.worldImageFileId = world.imageFileId
      location.worldImageFileVersion = world.imageFileVersion
    }
  }

  private async enrichLocationWithGroupInfo(groupLocation: LocationInstanceGroup) {
    const group = await this.groups.Fetcher.fetchGroupEntities(groupLocation.groupId)
    if (group) {
      groupLocation.groupName = group.groupName
      groupLocation.groupImageFileId = group.iconFileId
      groupLocation.groupImageFileVersion = group.iconFileVersion
    }
  }
}
