import type { VRChatAPI } from '../vrchat-api'
import type { VRChatGroups } from '../vrchat-groups'
import type { VRChatWorlds } from '../vrchat-worlds'
import type { VRChatUsers } from '../vrchat-users'
import type { FriendsRepository } from './repository'
import type { FriendProcessHandler } from './types'
import type { FriendInformation } from '@shared/definition/vrchat-friends'
import type {
  LocationInstance,
  LocationInstanceGroupSummary,
  LocationInstanceSummary
} from '@shared/definition/vrchat-instances'
import type { LimitedUserFriend, World } from '@shared/definition/vrchat-api-response'
import type { WorldEntity } from '../database/entities/vrchat-cache-world'
import type { GroupEntity } from '../database/entities/vrchat-cache-group'
import type { LoggerFactory } from '@main/logger'
import { parseFileUrl } from '../vrchat-files/factory'
import { parseLocation } from '../vrchat-worlds/location-parser'
import { toFriendUserEntity } from '../vrchat-users/factory'
import { isGroupInstance } from '../vrchat-worlds/utils'
import { toBaseFriendInformation, toFriendInstanceDependency } from './factory'
import { ONLINE_FRIENDS_QUERY_SIZE, OFFLINE_FRIENDS_QUERY_SIZE } from './constants'

export class FriendsFetcher {
  constructor(
    private readonly logger: LoggerFactory,
    private readonly repository: FriendsRepository,
    private readonly api: VRChatAPI,
    private readonly groups: VRChatGroups,
    private readonly worlds: VRChatWorlds,
    private readonly users: VRChatUsers
  ) {}

  public async initFriends() {
    const processHandler = (queueFriends: FriendInformation[]) => {
      this.repository.set(queueFriends)
    }

    this.repository.clear()

    const friends: FriendInformation[] = []
    const onlineFriends = await this.loadFriends(false, ONLINE_FRIENDS_QUERY_SIZE, processHandler)
    const offlineFriends = await this.loadFriends(true, OFFLINE_FRIENDS_QUERY_SIZE, processHandler)
    friends.push(...onlineFriends)
    friends.push(...offlineFriends)

    await this.users.saveUserEntities(friends.map(toFriendUserEntity))
    this.repository.set(friends)
    this.logger.info(
      `Fetched ${friends.length} friends in total.`,
      `Online: ${onlineFriends.length}`,
      `Offline: ${offlineFriends.length}`
    )
  }

  private async loadFriends(
    offline: boolean,
    querySize: number,
    processHandler?: FriendProcessHandler
  ): Promise<FriendInformation[]> {
    const friends: FriendInformation[] = []
    let startOffset = 0

    while (true) {
      const result = await this.api.ref.sessionAPI.friends.getFriends(startOffset, querySize, {
        offline
      })

      if (!result.success) {
        this.logger.error(`Failed to fetch friends, error: ${result.error.message}`)
        break
      }

      const friendsBatch = result.value.body

      if (friendsBatch.length === 0) {
        break
      }

      const { groupIds, worldIds } = toFriendInstanceDependency(friendsBatch)
      const worlds = await this.worlds.fetchWorldSummaries(worldIds)
      const groups = await this.groups.fetchGroupSummaries(groupIds)
      const currentFriends: FriendInformation[] = []

      for (const friend of friendsBatch) {
        const processedFriend = this.processFriend(friend, worlds, groups)
        friends.push(processedFriend)
        currentFriends.push(processedFriend)
      }

      startOffset += friendsBatch.length
      processHandler?.(currentFriends)

      this.logger.info(`Fetched ${friends.length} ${offline ? 'offline' : 'online'} friends...`)

      if (friendsBatch.length < querySize) {
        break
      }
    }

    return friends
  }

  public processFriend(
    friend: LimitedUserFriend,
    worlds: Map<string, WorldEntity>,
    groups: Map<string, GroupEntity>
  ): FriendInformation {
    const order = this.repository.getFriendUserIndex(friend.id)
    const location = parseLocation(friend.location)
    const locationArrivedAt = location ? new Date() : null
    const locationSummary = <LocationInstanceSummary>location

    if (location) {
      const world = worlds.get(location.worldId)
      if (world) {
        locationSummary.worldName = world.worldName
        locationSummary.worldImageFileId = world.imageFileId
        locationSummary.worldImageFileVersion = world.imageFileVersion
      } else {
        locationSummary.worldName = 'Unknown World'
      }
    }

    if (location && isGroupInstance(location)) {
      const groupLocation = locationSummary as LocationInstanceGroupSummary
      const group = groups.get(groupLocation.groupId)
      if (group) {
        groupLocation.groupName = group.groupName
        groupLocation.groupImageFileId = group.iconFileId
        groupLocation.groupImageFileVersion = group.iconFileVersion
      } else {
        groupLocation.groupName = 'Unknown Group'
      }
    }

    return {
      ...toBaseFriendInformation(friend),
      order,
      isTraveling: false,
      location: locationSummary,
      locationArrivedAt
    }
  }

  public async enrichLocation(location: LocationInstance, world: World) {
    let nextLocationSummary: LocationInstanceSummary | null = null

    if (world) {
      nextLocationSummary = await this.enrichLocationWithWorldInfo(location, world)
    }

    if (nextLocationSummary && isGroupInstance(nextLocationSummary)) {
      nextLocationSummary = await this.groups.enrichLocationWithGroupInfo(nextLocationSummary)
    }

    return nextLocationSummary
  }

  public enrichLocationWithWorldInfo(location: LocationInstance, world: World) {
    const worldImageInfo = parseFileUrl(world.imageUrl)
    const summary = <LocationInstanceSummary>{
      ...location,
      worldName: 'Unknown World',
      worldImageFileId: '',
      worldImageFileVersion: 0
    }

    if (world) {
      summary.worldName = world.name
      summary.worldImageFileId = worldImageInfo?.fileId || ''
      summary.worldImageFileVersion = worldImageInfo?.version || 0
    }

    return summary
  }
}
