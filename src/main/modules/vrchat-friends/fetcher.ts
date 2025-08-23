import type { VRChatAPI } from '../vrchat-api'
import type { VRChatGroups } from '../vrchat-groups'
import type { VRChatWorlds } from '../vrchat-worlds'
import type { VRChatUsers } from '../vrchat-users'
import type { FriendsRepository } from './repository'
import type { FriendLoaderProcessHandler } from './types'
import type { FriendInformation } from '@shared/definition/vrchat-friends'
import type { LocationInstanceGroup } from '@shared/definition/vrchat-instances'
import type { LimitedUserFriend } from '@shared/definition/vrchat-api-response'
import type { WorldEntity } from '../database/entities/world'
import type { GroupEntity } from '../database/entities/group'
import type { LoggerFactory } from '@main/logger'
import { parseLocation } from '../vrchat-worlds/parser'
import { toFriendUserEntity } from '../vrchat-users/factory'
import { isGroupInstance } from '../vrchat-worlds/factory'
import { toBaseFriendInformation, toFriendInstanceDependency } from './factory'
import { FRIENDS_QUERY_SIZE } from './constants'

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
    const onlineFriends = await this.loadFriends(false, processHandler)
    const offlineFriends = await this.loadFriends(true, processHandler)
    friends.push(...onlineFriends)
    friends.push(...offlineFriends)

    await this.users.Repository.saveUserEntities(friends.map(toFriendUserEntity))
    this.repository.set(friends)
    this.logger.info(
      `Fetched ${friends.length} friends in total.`,
      `Online: ${onlineFriends.length}`,
      `Offline: ${offlineFriends.length}`
    )
  }

  private async loadFriends(
    offline: boolean,
    processHandler?: FriendLoaderProcessHandler
  ): Promise<FriendInformation[]> {
    const friends: FriendInformation[] = []
    let startOffset = 0

    while (true) {
      const result = await this.api.ref.sessionAPI.friends.getFriends(
        startOffset,
        FRIENDS_QUERY_SIZE,
        {
          offline
        }
      )

      if (!result.success) {
        this.logger.warn('Failed to fetch friends')
        break
      }

      const friendsBatch = result.value.body

      if (friendsBatch.length === 0) {
        break
      }

      const { groupIds, worldIds } = toFriendInstanceDependency(friendsBatch)
      const worlds = await this.worlds.Fetcher.fetchWorldEntities(worldIds)
      const groups = await this.groups.Fetcher.fetchGroupEntities(groupIds)
      const currentFriends: FriendInformation[] = []

      for (const friend of friendsBatch) {
        const processedFriend = this.processFriend(friend, worlds, groups)
        friends.push(processedFriend)
        currentFriends.push(processedFriend)
      }

      startOffset += friendsBatch.length
      processHandler?.(currentFriends)

      this.logger.info(`Fetched ${friends.length} ${offline ? 'offline' : 'online'} friends...`)

      if (friendsBatch.length < FRIENDS_QUERY_SIZE) {
        break
      }
    }

    return friends
  }

  private processFriend(
    friend: LimitedUserFriend,
    worlds: Map<string, WorldEntity>,
    groups: Map<string, GroupEntity>
  ): FriendInformation {
    const note = this.users.Repository.getNote(friend.id)
    const location = parseLocation(friend.location)
    const locationArrivedAt = location ? new Date() : null

    if (location) {
      const world = worlds.get(location.worldId)
      if (world) {
        location.worldName = world.worldName
        location.worldImageFileId = world.imageFileId
        location.worldImageFileVersion = world.imageFileVersion
      } else {
        location.worldName = 'Unknown World'
      }
    }

    if (location && isGroupInstance(location)) {
      const groupLocation = location as LocationInstanceGroup
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
      note: note ? note.note : null,
      isTraveling: false,
      location,
      locationArrivedAt
    }
  }
}
