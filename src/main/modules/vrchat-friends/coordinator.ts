import { PipelineEvents } from '@shared/definition/vrchat-pipeline'
import { toWorldEntity } from '../vrchat-worlds/factory'
import { toBaseFriendInformation } from './factory'
import { UserState } from '@shared/definition/vrchat-api-response-community'
import type { VRChatPipeline } from '../vrchat-pipeline'
import type { FriendsFetcher } from './fetcher'
import type { FriendsStore } from './friend-store'
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
import { LoggerFactory } from '@main/logger'

export class FriendsCoordinator {
  private shieldedPipelineEvent = false

  constructor(
    private readonly logger: LoggerFactory,
    private readonly pipeline: VRChatPipeline,
    private readonly store: FriendsStore,
    private readonly fetcher: FriendsFetcher
  ) {
    this.bindEvents()
  }

  public async initialize() {
    // pause pipeline event processing
    this.shieldedPipelineEvent = true

    const result = await this.fetcher.fetchCurrentFriends((f) => this.store.presentFriends(f))
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
    this.store.clear()
  }

  public bindEvents() {
    this.pipeline.on('message', (message: PipelineEventMessage) => {
      if (this.shieldedPipelineEvent) {
        return
      }

      this.handlePipeMessage(message)
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
    const friend = toBaseFriendInformation(user)
    this.store.addFriend({
      ...friend,
      currentLocationRaw: user.location || '',
      travelingLocationRaw: ''
    })
  }

  private async handleFriendDelete({ userId }: PipelineEventFriendDelete): Promise<void> {
    this.store.deleteFriend(userId)
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
    this.store.updateFriendState(userId, UserState.Online, platform, toBaseFriendInformation(user))
    this.store.updateFriendLocation(userId, location, travelingToLocation, worldSummary)
  }

  private async handleFriendOffline({
    userId,
    platform
  }: PipelineEventFriendOffline): Promise<void> {
    this.store.updateFriendState(userId, UserState.Offline, platform)
  }

  private async handleFriendActive({
    userId,
    user,
    platform
  }: PipelineEventFriendActive): Promise<void> {
    this.store.updateFriendState(userId, UserState.Active, platform, toBaseFriendInformation(user))
  }

  private async handleFriendLocation({
    userId,
    world,
    location,
    travelingToLocation
  }: PipelineEventFriendLocation): Promise<void> {
    const worldSummary = world ? toWorldEntity(world) : undefined
    this.store.updateFriendLocation(userId, location, travelingToLocation, worldSummary)
  }

  private async handleFriendUpdate({ user, userId }: PipelineEventFriendUpdate): Promise<void> {
    this.store.updateFriendAttributes(userId, toBaseFriendInformation(user))
  }
}
