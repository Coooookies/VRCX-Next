import { PipelineEvents } from '@shared/definition/vrchat-pipeline'
import { toWorldEntity } from '../vrchat-worlds/factory'
import { toBaseFriendInformation } from './factory'
import { LoggerFactory } from '@main/logger'
import { UserState } from '@shared/definition/vrchat-api-response'
import type { VRChatPipeline } from '../vrchat-pipeline'
import type { FriendsFetcher } from './fetcher'
import type { FriendsSessions } from './friend-sessions'
import type { FriendsActivities } from './friend-activities'
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

export class FriendsCoordinator {
  private shieldedPipelineEvent = false

  constructor(
    private readonly logger: LoggerFactory,
    private readonly pipeline: VRChatPipeline,
    private readonly sessions: FriendsSessions,
    private readonly activities: FriendsActivities,
    private readonly fetcher: FriendsFetcher
  ) {
    this.bindEvents()
  }

  public async initialize() {
    // pause pipeline event processing
    this.shieldedPipelineEvent = true

    const result = await this.fetcher.fetchCurrentFriends((friends) => {
      this.sessions.syncInitialFriends(friends)
    })

    await this.processCachedPipelineEvents()

    this.logger.info(
      `Fetched ${result.friends.length} friends in total.`,
      `Online: ${result.onlineCount}`,
      `Offline: ${result.offlineCount}`
    )

    // resume pipeline event processing
    this.shieldedPipelineEvent = false
  }

  public uninitialize() {
    this.sessions.clearFriends()
  }

  public bindEvents() {
    this.pipeline.on('message', (message: PipelineEventMessage) => {
      if (this.shieldedPipelineEvent) {
        return
      }

      this.handlePipeMessage(message)
    })

    this.sessions.on('event:friend-avatar', (userId, user, avatar, detailPromise) => {
      this.activities.handleAvatarChangeActivity(userId, user, avatar, detailPromise)
    })

    this.sessions.on('event:friend-location', (userId, user, location, detailPromise) => {
      this.activities.handleLocationChangeActivity(userId, user, location, detailPromise)
    })

    this.sessions.on('event:friend-update', (userId, user, detailDiff, updatedKeys) => {
      this.activities.handleAttributeChangeActivities(userId, user, detailDiff, updatedKeys)
    })

    this.sessions.on('event:friend-online', (userId, user, beforeState) => {
      this.activities.handleStateChangeActivities(userId, user, beforeState, UserState.Online)
    })

    this.sessions.on('event:friend-offline', (userId, user, beforeState) => {
      this.activities.handleStateChangeActivities(userId, user, beforeState, UserState.Offline)
    })

    this.sessions.on('event:friend-web-active', (userId, user, beforeState) => {
      this.activities.handleStateChangeActivities(userId, user, beforeState, UserState.Active)
    })
  }

  private processCachedPipelineEvents() {
    for (const message of this.pipeline.cachedEvents) {
      this.handlePipeMessage(message)
    }
  }

  private async handlePipeMessage(message: PipelineEventMessage): Promise<void> {
    switch (message.type) {
      case PipelineEvents.FriendAdd: {
        await this.handleFriendAdd(message.content)
        break
      }
      case PipelineEvents.FriendDelete: {
        this.handleFriendDelete(message.content)
        break
      }
      case PipelineEvents.FriendOnline: {
        this.handleFriendOnline(message.content)
        break
      }
      case PipelineEvents.FriendOffline: {
        this.handleFriendOffline(message.content)
        break
      }
      case PipelineEvents.FriendLocation: {
        this.handleFriendLocation(message.content)
        break
      }
      case PipelineEvents.FriendActive: {
        this.handleFriendActive(message.content)
        break
      }
      case PipelineEvents.FriendUpdate: {
        this.handleFriendUpdate(message.content)
        break
      }
    }
  }

  private async handleFriendAdd({ user }: PipelineEventFriendAdd): Promise<void> {
    this.sessions.handleAppendFriend(toBaseFriendInformation(user))
  }

  private async handleFriendDelete({ userId }: PipelineEventFriendDelete): Promise<void> {
    this.sessions.handleRemoveFriend(userId)
  }

  private async handleFriendOnline({
    userId,
    user,
    world,
    platform,
    location,
    travelingToLocation
  }: PipelineEventFriendOnline): Promise<void> {
    const worldSummary = world ? toWorldEntity(world) : undefined
    const baseInformation = toBaseFriendInformation(user)
    this.sessions.handleUpdateFriendOnline(
      userId,
      baseInformation,
      platform,
      location,
      travelingToLocation,
      worldSummary
    )
  }

  private async handleFriendOffline({
    userId,
    platform
  }: PipelineEventFriendOffline): Promise<void> {
    this.sessions.handleUpdateFriendOffline(userId, platform)
  }

  private async handleFriendActive({
    userId,
    user,
    platform
  }: PipelineEventFriendActive): Promise<void> {
    this.sessions.handleUpdateFriendWebActive(userId, toBaseFriendInformation(user), platform)
  }

  private async handleFriendLocation({
    userId,
    world,
    location,
    travelingToLocation
  }: PipelineEventFriendLocation): Promise<void> {
    const worldSummary = world ? toWorldEntity(world) : undefined
    this.sessions.handleUpdateFriendLocation(userId, location, travelingToLocation, worldSummary)
  }

  private async handleFriendUpdate({ user, userId }: PipelineEventFriendUpdate): Promise<void> {
    this.sessions.handleUpdateFriendAttributes(userId, toBaseFriendInformation(user))
  }
}
