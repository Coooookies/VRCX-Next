import { toBaseFriendInformation } from './factory'
import { ONLINE_FRIENDS_QUERY_SIZE, OFFLINE_FRIENDS_QUERY_SIZE } from './constants'
import type { VRChatAPI } from '../vrchat-api'
import type { LoggerFactory } from '@main/logger'
import type { FriendFetcherProcessHandler, FriendInformationWithRawLocation } from './types'

export class FriendsFetcher {
  constructor(
    private readonly logger: LoggerFactory,
    private readonly api: VRChatAPI
  ) {}

  public async fetchCurrentFriends(processHandler?: FriendFetcherProcessHandler) {
    const friends: FriendInformationWithRawLocation[] = []
    const onlineFriends = await this.fetchFriends(false, ONLINE_FRIENDS_QUERY_SIZE, processHandler)
    const offlineFriends = await this.fetchFriends(true, OFFLINE_FRIENDS_QUERY_SIZE, processHandler)
    friends.push(...onlineFriends)
    friends.push(...offlineFriends)

    return {
      friends,
      onlineCount: onlineFriends.length,
      offlineCount: offlineFriends.length
    }
  }

  private async fetchFriends(
    offline: boolean,
    querySize: number,
    processHandler?: FriendFetcherProcessHandler
  ): Promise<FriendInformationWithRawLocation[]> {
    const friends: FriendInformationWithRawLocation[] = []
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

      const currentFriends = friendsBatch.map<FriendInformationWithRawLocation>((friend) => {
        const baseFriend = toBaseFriendInformation(friend)
        const currentLocationRaw = friend.location || ''
        const travelingLocationRaw = ''

        return {
          ...baseFriend,
          currentLocationRaw,
          travelingLocationRaw
        }
      })

      friends.push(...currentFriends)
      startOffset += friendsBatch.length
      processHandler?.(currentFriends)

      this.logger.info(`Fetched ${friends.length} ${offline ? 'offline' : 'online'} friends...`)

      if (friendsBatch.length < querySize) {
        break
      }
    }

    return friends
  }
}
