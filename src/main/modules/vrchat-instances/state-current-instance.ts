import Nanobus from 'nanobus'
import { debounce } from 'lodash'
import { toUserInformationSummary } from '../vrchat-users/factory'
import { parseLocation } from '../vrchat-worlds/location-parser'
import { generateInstanceRecordId } from './utils'
import { INSTANCE_USERS_INITIAL_BATCH_DELAY } from './constants'
import { LogEvents } from '../vrchat-log-watcher/types'
import {
  InstanceEvents,
  LocationInstanceGroupType,
  LocationInstancePublicType,
  LocationInstanceUserType
} from '@shared/definition/vrchat-instances'
import type {
  InstanceEventMessage,
  InstanceUserSummary,
  LocationInstance,
  LocationOwner
} from '@shared/definition/vrchat-instances'
import type { VRChatLogWatcher } from '../vrchat-log-watcher'
import type { VRChatUsers } from '../vrchat-users'
import type { VRChatWorlds } from '../vrchat-worlds'
import type { VRChatGroups } from '../vrchat-groups'
import type { WorldDetail } from '@shared/definition/vrchat-worlds'
import type { InstanceData, InstanceUserPresentEvent } from './types'
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

export class CurrentInstance extends Nanobus<{
  'instance:left': () => void
  'instance:joined': (location: LocationInstance) => void
  'instance:world-summary-initialized': (detail: WorldDetail | null) => void
  'instance:owner-summary-initialized': (detail: LocationOwner | null) => void
  'instance:present-progress': (
    users: InstanceUserSummary[],
    events: InstanceEventMessage[]
  ) => void
  'instance:present-loaded': (users: InstanceUserSummary[], events: InstanceEventMessage[]) => void
  'instance:event': (activity: InstanceEventMessage) => void
  'user:joined': (user: InstanceUserSummary) => void
  'user:left': (userId: string) => void
  'video:playback-load': (url: string) => void
  'video:playback-error': (reason: string) => void
}> {
  private isListening = false
  private isInitialBatchMode = false
  private isPending = false
  private isCurrentUserInInstance = false

  private initialEvents: LogEventSummary[] = []
  private pendingCacheEvents: LogEventSummary[] = []
  private resetInitialBatchTimer = debounce(() => {
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
      if (!this.isListening) {
        return
      }

      if (this.isPending) {
        this.pendingCacheEvents.push({ data, context })
        return
      }

      this.handleMessage(data, context)
    })
  }

  public async start(ignoreHistoryLog?: boolean) {
    if (this.isListening && this.isPending) {
      return
    }

    return this.listen(ignoreHistoryLog)
  }

  public async stop() {
    this.isListening = false
    this.clearState()
    this.repository.clearCurrentInstance()
    await this.resetInitialBatchTimer.cancel()
  }

  private async listen(ignoreHistoryLog?: boolean) {
    this.isListening = true

    if (!ignoreHistoryLog) {
      this.isPending = true

      const latestInstance = await this.getLatestInstance()
      if (latestInstance && !latestInstance.isLeft) {
        await this.initializeInstance(latestInstance)
      }

      this.isPending = false
    }

    return this.processCacheEvents()
  }

  private async getLatestInstance(): Promise<InstanceData | null> {
    const events = await this.resolveLatestInstanceEvents()
    return this.parseInstanceFromEvents(events.reverse())
  }

  private async resolveLatestInstanceEvents() {
    return this.logWatcher.resolveBackwardEvents(1500, (data, _, signal) => {
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
    })
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
          if (event.data.content.userId) {
            if (
              this.users.currentUser &&
              this.users.currentUser.userId === event.data.content.userId
            ) {
              isCurrentUserInInstance = true
            }

            users.set(event.data.content.userId, {
              userId: event.data.content.userId,
              userName: event.data.content.userName,
              joinedAt: event.context.date
            })

            userEvents.push({
              userId: event.data.content.userId,
              userName: event.data.content.userName,
              type: isCurrentUserInInstance ? InstanceEvents.UserJoin : InstanceEvents.UserPresent,
              recordedAt: event.context.date
            })
          }
          break
        }
        case LogEvents.PlayerLeft: {
          if (event.data.content.userId) {
            users.delete(event.data.content.userId)
            userEvents.push({
              userId: event.data.content.userId,
              userName: event.data.content.userName,
              type: InstanceEvents.UserLeave,
              recordedAt: event.context.date
            })
          }
          break
        }
        case LogEvents.VideoPlaybackLoad: {
          videoEvents.push({
            type: InstanceEvents.VideoPlaybackLoad,
            recordedAt: event.context.date,
            content: {
              url: event.data.content.url
            }
          })
          break
        }
        case LogEvents.VideoPlaybackError: {
          videoEvents.push({
            type: InstanceEvents.VideoPlaybackError,
            recordedAt: event.context.date,
            content: {
              reason: event.data.content.reason
            }
          })
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

  private async initializeInstance(instance: InstanceData): Promise<void> {
    const { location, users, userEvents, videoEvents, joinedAt } = instance
    const recordId = generateInstanceRecordId(location.worldId, location.name, joinedAt)

    this.repository.setCurrentInstanceRecordId(recordId)
    this.repository.setCurrentInstanceLoading(true)
    this.repository.setCurrentInstanceLocation(location, joinedAt)
    this.repository.setCurrentInstanceJoined(true)

    await this.processWorldSummary(location.worldId)
    await this.processWorldOwner(location)
    await this.processInitialInstance(users, userEvents, videoEvents)

    this.isInitialBatchMode = users.length === 0
    this.isCurrentUserInInstance = instance.isCurrentUserInInstance
    this.repository.setCurrentInstanceLoading(false)
  }

  private async processWorldSummary(worldId: string) {
    const detail = await this.world.fetchWorld(worldId, {
      ignoreInstances: true
    })

    this.repository.setCurrentInstanceWorldDetail(detail)
    this.emit('instance:world-summary-initialized', detail)
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
    this.emit('instance:owner-summary-initialized', owner)
  }

  private async processInitialInstance(
    users: InstanceUser[],
    userEvents: InstanceUserPresentEvent[],
    videoEvents: InstanceEventMessage[]
  ) {
    // preset null user to avoid flickering
    this.repository.upsertCurrentInstanceUser(users.map((u) => ({ ...u, user: null })))

    // fetch users and activities
    const { usersSummaries, presentEvents: userPresentEvents } =
      await this.fetcher.fetchInstancePresent(users, userEvents, (users, activities) => {
        this.repository.upsertCurrentInstanceUser(users)
        this.emit('instance:present-progress', users, activities)
      })

    const totalEvents = [...userPresentEvents, ...videoEvents]
    this.repository.upsertCurrentInstanceUser(usersSummaries)
    this.repository.appendCurrentInstanceEvent(totalEvents)
    this.emit('instance:present-loaded', usersSummaries, totalEvents)
  }

  private async processCacheEvents() {
    for (const event of this.pendingCacheEvents) {
      await this.handleMessage(event.data, event.context)
    }

    this.pendingCacheEvents = []
  }

  private async processInitialBatchEvents() {
    this.isInitialBatchMode = false
    this.isPending = true

    const { users, userEvents, videoEvents, isCurrentUserInInstance } = this.parseInstanceEvents(
      this.initialEvents
    )

    await this.processInitialInstance(users, userEvents, videoEvents)

    this.isPending = false
    this.initialEvents = []
    this.isCurrentUserInInstance = isCurrentUserInInstance

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
    }
  }

  private async handleSelfJoin(data: LogEventSelfJoin, context: LogEventContext) {
    const location = parseLocation(data.location)
    if (!location) {
      return
    }

    const recordId = generateInstanceRecordId(location.worldId, location.name, context.date)

    this.isInitialBatchMode = true
    this.isCurrentUserInInstance = false
    this.isPending = false

    this.repository.clearCurrentInstance()
    this.repository.setCurrentInstanceRecordId(recordId)
    this.repository.setCurrentInstanceLoading(true)
    this.repository.setCurrentInstanceLocation(location, context.date)
    this.repository.setCurrentInstanceJoined(true)
    this.emit('instance:joined', location)

    await this.processWorldSummary(location.worldId)
    await this.processWorldOwner(location)
  }

  private async handleSelfLeave() {
    this.repository.setCurrentInstanceJoined(false)
    this.emit('instance:left')
    await this.resetInitialBatchTimer.cancel()
  }

  private async handlePlayerJoined(data: LogEventPlayerActivity, context: LogEventContext) {
    if (!data.userId) {
      return
    }

    const user = {
      userId: data.userId,
      userName: data.userName
    }

    if (this.isInitialBatchMode) {
      await this.handlePlayerJoinedInBatchMode(user, context)
    } else {
      await this.handlePlayerJoinedNormal(user, context)
    }
  }

  private async handlePlayerJoinedInBatchMode(
    user: Pick<InstanceUser, 'userId' | 'userName'>,
    context: LogEventContext
  ): Promise<void> {
    this.resetInitialBatchTimer()
    this.initialEvents.push({
      data: { type: LogEvents.PlayerJoined, content: user },
      context
    })
  }

  private async handlePlayerJoinedNormal(
    user: Pick<InstanceUser, 'userId' | 'userName'>,
    context: LogEventContext
  ): Promise<void> {
    // preset null user to avoid flickering
    this.repository.upsertCurrentInstanceUser({
      ...user,
      joinedAt: context.date,
      user: null
    })

    const userInformation = await this.users.fetchUser(user.userId)
    const userSummary = userInformation ? toUserInformationSummary(userInformation) : null

    if (this.isCurrentUser(user.userId)) {
      this.isCurrentUserInInstance = true
    }

    const roomUserSummary = {
      ...user,
      joinedAt: context.date,
      user: userInformation
    }

    const presentEvent: InstanceEventMessage = {
      type: this.isCurrentUserInInstance ? InstanceEvents.UserJoin : InstanceEvents.UserPresent,
      recordedAt: context.date,
      content: {
        userId: user.userId,
        userName: user.userName,
        userSummary: userSummary
      }
    }

    this.repository.upsertCurrentInstanceUser(roomUserSummary)
    this.repository.appendCurrentInstanceEvent(presentEvent)
    this.emit('user:joined', roomUserSummary)
    this.emit('instance:event', presentEvent)
  }

  private async handlePlayerLeft(data: LogEventPlayerActivity, context: LogEventContext) {
    if (!data.userId) {
      return
    }

    const user = {
      userId: data.userId,
      userName: data.userName
    }

    if (this.isInitialBatchMode) {
      await this.handlePlayerLeftInBatchMode(user, context)
    } else {
      await this.handlePlayerLeftNormal(user, context)
    }
  }

  private async handlePlayerLeftInBatchMode(
    user: Pick<InstanceUser, 'userId' | 'userName'>,
    context: LogEventContext
  ): Promise<void> {
    this.initialEvents.push({
      data: { type: LogEvents.PlayerLeft, content: user },
      context
    })
  }

  private async handlePlayerLeftNormal(
    user: Pick<InstanceUser, 'userId' | 'userName'>,
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
    this.emit('user:left', user.userId)
    this.emit('instance:event', presentEvent)
  }

  private async handleVideoPlaybackLoad(url: string, context: LogEventContext) {
    const event: InstanceEventMessage = {
      type: InstanceEvents.VideoPlaybackLoad,
      recordedAt: context.date,
      content: {
        url
      }
    }

    this.repository.appendCurrentInstanceEvent(event)
    this.emit('instance:event', event)
    this.emit('video:playback-load', url)
  }

  private async handleVideoPlaybackError(reason: string, context: LogEventContext) {
    const event: InstanceEventMessage = {
      type: InstanceEvents.VideoPlaybackError,
      recordedAt: context.date,
      content: {
        reason
      }
    }

    this.repository.appendCurrentInstanceEvent(event)
    this.emit('instance:event', event)
    this.emit('video:playback-error', reason)
  }

  private clearState() {
    this.isInitialBatchMode = false
    this.isPending = false
    this.isCurrentUserInInstance = false
  }

  private isCurrentUser(userId: string): boolean {
    return this.users.currentUser?.userId === userId
  }

  public get isJoined(): boolean {
    return this.repository.State.currentInstance.joined
  }

  public get locationInstance(): LocationInstance | null {
    return this.repository.State.currentInstance.locationInstance
  }

  public get recordId(): string | null {
    return this.repository.State.currentInstance.recordId
  }
}
