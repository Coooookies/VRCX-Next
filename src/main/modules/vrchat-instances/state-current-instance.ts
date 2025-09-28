import Nanobus from 'nanobus'
import { debounce } from 'lodash'
import { toUserInformationSummary } from '../vrchat-users/factory'
import { parseLocation } from '../vrchat-worlds/location-parser'
import { generateInstanceRecordId } from './utils'
import { CURRENT_INSTANCE_LOG_EVENTS_LIMIT, INSTANCE_USERS_INITIAL_BATCH_DELAY } from './constants'
import { LogEvents } from '../vrchat-log-watcher/types'
import {
  InstanceEvents,
  LocationInstanceGroupType,
  LocationInstancePublicType,
  LocationInstanceUserType
} from '@shared/definition/vrchat-instances'
import type {
  InstanceEventMessage,
  LocationInstance,
  LocationOwner
} from '@shared/definition/vrchat-instances'
import type { VRChatLogWatcher } from '../vrchat-log-watcher'
import type { VRChatUsers } from '../vrchat-users'
import type { VRChatWorlds } from '../vrchat-worlds'
import type { VRChatGroups } from '../vrchat-groups'
import type {
  CurrentInstanceEmitEvent,
  CurrentInstancePlayerActivityEvent,
  CurrentInstanceState,
  InstanceData,
  InstanceUserPresentEvent
} from './types'
import type { InstanceFetcher } from './fetcher'
import type { InstanceRepository } from './repository'
import type { InstanceUser } from '@shared/definition/vrchat-instances'
import type {
  LogEventContext,
  LogEventMessage,
  LogEventPlayerActivity,
  LogEventSelfJoin,
  LogEventSummary
} from '../vrchat-log-watcher/types'

export class CurrentInstance extends Nanobus<CurrentInstanceEmitEvent> {
  private readonly state: CurrentInstanceState = {
    isListening: false,
    isInitialBatchMode: false,
    isPending: false,
    isCurrentUserInInstance: false
  }

  private initialEvents: LogEventSummary[] = []
  private pendingCacheEvents: LogEventSummary[] = []
  private readonly resetInitialBatchTimer = debounce(() => {
    this.processInitialBatchEvents()
  }, INSTANCE_USERS_INITIAL_BATCH_DELAY)

  constructor(
    private readonly repository: InstanceRepository,
    private readonly fetcher: InstanceFetcher,
    private readonly logWatcher: VRChatLogWatcher,
    private readonly users: VRChatUsers,
    private readonly world: VRChatWorlds,
    private readonly group: VRChatGroups
  ) {
    super('VRChatInstances:CurrentInstance')
  }

  public bindEvents() {
    this.logWatcher.on('message', (data, context) => {
      if (!this.state.isListening) {
        return
      }

      if (this.state.isPending) {
        this.pendingCacheEvents.push({ data, context })
        return
      }

      this.handleMessage(data, context)
    })
  }

  public async start(ignoreHistoryLog?: boolean) {
    if (this.state.isListening && this.state.isPending) {
      return
    }

    return this.listen(ignoreHistoryLog)
  }

  public async stop() {
    this.state.isListening = false
    this.clearState()
    this.repository.clearCurrentInstance()
    await this.resetInitialBatchTimer.cancel()
  }

  private async listen(ignoreHistoryLog?: boolean) {
    this.state.isListening = true

    if (!ignoreHistoryLog) {
      this.state.isPending = true

      const latestInstance = await this.getLatestInstance()
      if (latestInstance && !latestInstance.isLeft) {
        await this.initializeInstance(latestInstance)
      }

      this.state.isPending = false
    }

    return this.processCacheEvents()
  }

  private async getLatestInstance(): Promise<InstanceData | null> {
    const events = await this.resolveLatestInstanceEvents()
    return this.parseInstanceFromEvents(events.reverse())
  }

  private async resolveLatestInstanceEvents() {
    return this.logWatcher.resolveBackwardEvents(
      CURRENT_INSTANCE_LOG_EVENTS_LIMIT,
      (data, _, signal) => {
        switch (data.type) {
          case LogEvents.SelfLeave:
          case LogEvents.PlayerJoined:
          case LogEvents.PlayerLeft:
          case LogEvents.VideoPlaybackLoad:
          case LogEvents.VideoPlaybackError: {
            return true
          }
          case LogEvents.SelfJoin: {
            signal.stop(true)
            break
          }
        }

        return false
      }
    )
  }

  private parseInstanceFromEvents(events: LogEventSummary[]): InstanceData | null {
    let location: LocationInstance | null = null
    let joinedAt: Date | null = null
    let leftAt: Date | null = null
    let isLeft = false

    for (const event of events) {
      switch (event.data.type) {
        case LogEvents.SelfJoin: {
          location = parseLocation(event.data.content.location)
          joinedAt = event.context.date
          break
        }
        case LogEvents.SelfLeave: {
          isLeft = true
          leftAt = event.context.date
          break
        }
      }
    }

    return location && joinedAt
      ? {
          location,
          joinedAt,
          leftAt,
          isLeft,
          ...this.parseInstanceEvents(events)
        }
      : null
  }

  private parseInstanceEvents(events: LogEventSummary[]) {
    const users = new Map<string, InstanceUser>()
    const userEvents: InstanceUserPresentEvent[] = []
    const videoEvents: InstanceEventMessage[] = []
    let isCurrentUserInInstance = false

    for (const event of events) {
      switch (event.data.type) {
        case LogEvents.PlayerJoined: {
          const result = this.handlePlayerJoinedEvent(event, users, isCurrentUserInInstance)
          if (result) {
            isCurrentUserInInstance = result.isCurrentUserInInstance
            userEvents.push(result.event)
          }
          break
        }
        case LogEvents.PlayerLeft: {
          const result = this.handlePlayerLeftEvent(event, users)
          if (result) {
            userEvents.push(result)
          }
          break
        }
        case LogEvents.VideoPlaybackLoad:
        case LogEvents.VideoPlaybackError:
        case LogEvents.VoteKick: {
          const commonEvent = this.parseCommonEvent(event)
          if (commonEvent) {
            videoEvents.push(commonEvent)
          }
          break
        }
      }
    }

    return {
      users: [...users.values()],
      userEvents,
      videoEvents,
      isCurrentUserInInstance
    }
  }

  private handlePlayerJoinedEvent(
    event: LogEventSummary,
    users: Map<string, InstanceUser>,
    currentUserInInstance: boolean
  ) {
    if (event.data.type !== LogEvents.PlayerJoined || !event.data.content?.userId) {
      return null
    }

    const content = event.data.content as LogEventPlayerActivity
    if (!content.userId) {
      return null
    }

    const isCurrentUser = this.users.currentUser?.userId === content.userId

    if (isCurrentUser) {
      currentUserInInstance = true
    }

    users.set(content.userId, {
      userId: content.userId,
      userName: content.userName,
      joinedAt: event.context.date
    })

    return {
      isCurrentUserInInstance: currentUserInInstance,
      event: {
        userId: content.userId,
        userName: content.userName,
        type: isCurrentUser ? InstanceEvents.UserJoin : InstanceEvents.UserPresent,
        recordedAt: event.context.date
      } as InstanceUserPresentEvent
    }
  }

  private handlePlayerLeftEvent(event: LogEventSummary, users: Map<string, InstanceUser>) {
    if (event.data.type !== LogEvents.PlayerLeft || !event.data.content?.userId) {
      return null
    }

    const content = event.data.content as LogEventPlayerActivity
    if (!content.userId) {
      return null
    }

    users.delete(content.userId)

    return {
      userId: content.userId,
      userName: content.userName,
      type: InstanceEvents.UserLeave,
      recordedAt: event.context.date
    } as InstanceUserPresentEvent
  }

  private parseCommonEvent(event: LogEventSummary): InstanceEventMessage | null {
    if (!event.data.content) {
      return null
    }

    switch (event.data.type) {
      case LogEvents.VideoPlaybackLoad: {
        const content = event.data.content as { url: string }
        return {
          type: InstanceEvents.VideoPlaybackLoad,
          recordedAt: event.context.date,
          content: {
            url: content.url
          }
        }
      }
      case LogEvents.VideoPlaybackError: {
        const content = event.data.content as { reason: string }
        return {
          type: InstanceEvents.VideoPlaybackError,
          recordedAt: event.context.date,
          content: {
            reason: content.reason
          }
        }
      }
      case LogEvents.VoteKick: {
        const content = event.data.content as { userName: string }
        return {
          type: InstanceEvents.VoteKick,
          recordedAt: event.context.date,
          content: {
            userName: content.userName
          }
        }
      }
      default:
        return null
    }
  }

  private async initializeInstance(instance: InstanceData): Promise<void> {
    const { location, users, userEvents, videoEvents, joinedAt } = instance
    const recordId = generateInstanceRecordId(location.worldId, location.name, joinedAt)

    this.repository.setCurrentInstanceRecordId(recordId)
    this.repository.setCurrentInstanceLoading(true)
    this.repository.setCurrentInstanceLocation(location, joinedAt)
    this.repository.setCurrentInstanceJoined(true)

    const world = await this.processWorldSummary(location.worldId)
    const owner = await this.processWorldOwner(location)

    this.emit('instance:joined-complete', this.recordId!, location, world, owner)

    await this.processInitialInstance(users, userEvents, videoEvents)

    this.state.isInitialBatchMode = users.length === 0
    this.state.isCurrentUserInInstance = instance.isCurrentUserInInstance
    this.repository.setCurrentInstanceLoading(false)
  }

  private async processWorldSummary(worldId: string) {
    const detail = await this.world.fetchWorld(worldId, {
      ignoreInstances: true
    })

    this.repository.setCurrentInstanceWorldDetail(detail)
    this.emit('instance:world-summary-initialized', this.recordId!, detail)
    return detail
  }

  private async processWorldOwner(location: LocationInstance) {
    let owner: LocationOwner | null = null
    switch (location.type) {
      case LocationInstancePublicType.Public: {
        owner = {
          type: 'public',
          summary: null
        }
        break
      }
      case LocationInstanceUserType.Friends:
      case LocationInstanceUserType.FriendsPlus:
      case LocationInstanceUserType.Invite:
      case LocationInstanceUserType.InvitePlus: {
        owner = {
          type: 'user',
          summary: await this.users.fetchUserSummary(location.userId)
        }
        break
      }
      case LocationInstanceGroupType.Group:
      case LocationInstanceGroupType.GroupPlus:
      case LocationInstanceGroupType.GroupPublic: {
        owner = {
          type: 'group',
          summary: await this.group.fetchGroupSummary(location.groupId)
        }
        break
      }
    }

    this.repository.setCurrentInstanceLocationOwner(owner)
    this.emit('instance:owner-summary-initialized', this.recordId!, owner)
    return owner
  }

  private async processInitialInstance(
    users: InstanceUser[],
    userEvents: InstanceUserPresentEvent[],
    videoEvents: InstanceEventMessage[]
  ) {
    this.repository.upsertCurrentInstanceUser(users.map((u) => ({ ...u, user: null })))

    const { usersSummaries, presentEvents: userPresentEvents } =
      await this.fetcher.fetchInstancePresent(users, userEvents, (users, activities) => {
        this.repository.upsertCurrentInstanceUser(users)
        this.emit('instance:present-progress', this.recordId!, users, activities)
      })

    const totalEvents = [...userPresentEvents, ...videoEvents]
    this.repository.upsertCurrentInstanceUser(usersSummaries)
    this.repository.appendCurrentInstanceEvent(totalEvents)
    this.emit('instance:present-loaded', this.recordId!, usersSummaries, totalEvents)
    return { users: usersSummaries, events: totalEvents }
  }

  private async processCacheEvents() {
    for (const event of this.pendingCacheEvents) {
      await this.handleMessage(event.data, event.context)
    }

    this.pendingCacheEvents = []
  }

  private async processInitialBatchEvents() {
    this.state.isInitialBatchMode = false
    this.state.isPending = true

    const { users, userEvents, videoEvents, isCurrentUserInInstance } = this.parseInstanceEvents(
      this.initialEvents
    )

    await this.processInitialInstance(users, userEvents, videoEvents)

    this.state.isPending = false
    this.initialEvents = []
    this.state.isCurrentUserInInstance = isCurrentUserInInstance

    this.processCacheEvents()
    this.repository.setCurrentInstanceLoading(false)
  }

  private async handleMessage(data: LogEventMessage, context: LogEventContext) {
    switch (data.type) {
      case LogEvents.SelfJoin: {
        await this.handleSelfJoin(data.content, context)
        break
      }
      case LogEvents.SelfLeave: {
        await this.handleSelfLeave()
        break
      }
      case LogEvents.PlayerJoined: {
        await this.handlePlayerJoined(data.content, context)
        break
      }
      case LogEvents.PlayerLeft: {
        await this.handlePlayerLeft(data.content, context)
        break
      }
      case LogEvents.VideoPlaybackLoad: {
        await this.handleVideoPlaybackLoad(data.content.url, context)
        break
      }
      case LogEvents.VideoPlaybackError: {
        await this.handleVideoPlaybackError(data.content.reason, context)
        break
      }
      case LogEvents.VoteKick: {
        await this.handleVoteKick(data.content.userName, context)
        break
      }
    }
  }

  private async handleSelfJoin(data: LogEventSelfJoin, context: LogEventContext) {
    const location = parseLocation(data.location)
    if (!location) {
      return
    }

    const recordId = generateInstanceRecordId(location.worldId, location.name, context.date)

    this.state.isInitialBatchMode = true
    this.state.isCurrentUserInInstance = false
    this.state.isPending = false

    this.repository.clearCurrentInstance()
    this.repository.setCurrentInstanceRecordId(recordId)
    this.repository.setCurrentInstanceLoading(true)
    this.repository.setCurrentInstanceLocation(location, context.date)
    this.repository.setCurrentInstanceJoined(true)
    this.emit('instance:joined', this.recordId!, location)

    const world = await this.processWorldSummary(location.worldId)
    const owner = await this.processWorldOwner(location)

    this.emit('instance:joined-complete', this.recordId!, location, world, owner)
  }

  private async handleSelfLeave() {
    this.repository.setCurrentInstanceJoined(false)
    this.emit('instance:left', this.recordId!)
    await this.resetInitialBatchTimer.cancel()
  }

  private async handlePlayerJoined(data: LogEventPlayerActivity, context: LogEventContext) {
    if (!data.userId) {
      return
    }

    const user: CurrentInstancePlayerActivityEvent = {
      userId: data.userId,
      userName: data.userName
    }

    if (this.state.isInitialBatchMode) {
      await this.handlePlayerJoinedInBatchMode(user, context)
    } else {
      await this.handlePlayerJoinedNormal(user, context)
    }
  }

  private async handlePlayerJoinedInBatchMode(
    user: CurrentInstancePlayerActivityEvent,
    context: LogEventContext
  ): Promise<void> {
    this.resetInitialBatchTimer()
    this.initialEvents.push({
      data: { type: LogEvents.PlayerJoined, content: user },
      context
    })
  }

  private async handlePlayerJoinedNormal(
    user: CurrentInstancePlayerActivityEvent,
    context: LogEventContext
  ): Promise<void> {
    this.repository.upsertCurrentInstanceUser({
      ...user,
      joinedAt: context.date,
      user: null
    })

    const userInformation = await this.users.fetchUser(user.userId)
    const userSummary = userInformation ? toUserInformationSummary(userInformation) : null

    if (this.isUser(user.userId)) {
      this.state.isCurrentUserInInstance = true
    }

    const roomUserSummary = {
      ...user,
      joinedAt: context.date,
      user: userInformation
    }

    const presentEvent: InstanceEventMessage = {
      type: this.state.isCurrentUserInInstance
        ? InstanceEvents.UserJoin
        : InstanceEvents.UserPresent,
      recordedAt: context.date,
      content: {
        userId: user.userId,
        userName: user.userName,
        userSummary: userSummary
      }
    }

    this.repository.upsertCurrentInstanceUser(roomUserSummary)
    this.repository.appendCurrentInstanceEvent(presentEvent)
    this.emit('user:joined', this.recordId!, roomUserSummary)
  }

  private async handlePlayerLeft(data: LogEventPlayerActivity, context: LogEventContext) {
    if (!data.userId) {
      return
    }

    const user: CurrentInstancePlayerActivityEvent = {
      userId: data.userId,
      userName: data.userName
    }

    if (this.state.isInitialBatchMode) {
      await this.handlePlayerLeftInBatchMode(user, context)
    } else {
      await this.handlePlayerLeftNormal(user, context)
    }
  }

  private async handlePlayerLeftInBatchMode(
    user: CurrentInstancePlayerActivityEvent,
    context: LogEventContext
  ): Promise<void> {
    this.initialEvents.push({
      data: { type: LogEvents.PlayerLeft, content: user },
      context
    })
  }

  private async handlePlayerLeftNormal(
    user: CurrentInstancePlayerActivityEvent,
    context: LogEventContext
  ): Promise<void> {
    const summary = await this.users.fetchUserSummary(user.userId)
    const presentEvent: InstanceEventMessage = {
      type: InstanceEvents.UserLeave,
      recordedAt: context.date,
      content: {
        userId: user.userId,
        userName: user.userName,
        userSummary: summary
      }
    }

    this.repository.removeCurrentInstanceUser(user.userId)
    this.repository.appendCurrentInstanceEvent(presentEvent)
    this.emit('user:left', this.recordId!, user.userId)
  }

  private async handleVideoPlaybackLoad(url: string, context: LogEventContext) {
    const event: InstanceEventMessage = {
      type: InstanceEvents.VideoPlaybackLoad,
      recordedAt: context.date,
      content: { url }
    }
    this.repository.appendCurrentInstanceEvent(event)
    this.emit('video:playback-load', this.recordId!, url)
  }

  private async handleVideoPlaybackError(reason: string, context: LogEventContext) {
    const event: InstanceEventMessage = {
      type: InstanceEvents.VideoPlaybackError,
      recordedAt: context.date,
      content: { reason }
    }
    this.repository.appendCurrentInstanceEvent(event)
    this.emit('video:playback-error', this.recordId!, reason)
  }

  private async handleVoteKick(userName: string, context: LogEventContext) {
    const event: InstanceEventMessage = {
      type: InstanceEvents.VoteKick,
      recordedAt: context.date,
      content: { userName }
    }
    this.repository.appendCurrentInstanceEvent(event)
    this.emit('moderation:vote-kick', this.recordId!, userName)
  }

  private clearState() {
    this.state.isInitialBatchMode = false
    this.state.isPending = false
    this.state.isCurrentUserInInstance = false
  }

  private isUser(userId: string): boolean {
    return this.users.currentUser?.userId === userId
  }

  private get recordId(): string | null {
    return this.repository.currentRecordId
  }

  public get isJoined(): boolean {
    return this.repository.State.currentInstance.joined
  }

  public get locationInstance(): LocationInstance | null {
    return this.repository.State.currentInstance.locationInstance
  }
}
