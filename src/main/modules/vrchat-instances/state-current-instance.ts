import Nanobus from 'nanobus'
import { debounce } from 'lodash'
import { parseLocation } from '../vrchat-worlds/location-parser'
import { toUserInformationSummary } from '../vrchat-users/factory'
import { LogEvents } from '../vrchat-log-watcher/types'
import {
  InstanceUserActivityType,
  LocationInstanceGroupType,
  LocationInstancePublicType,
  LocationInstanceUserType
} from '@shared/definition/vrchat-instances'
import { INSTANCE_USERS_INITIAL_BATCH_DELAY } from './constants'
import type {
  InstanceUserActivitySummary,
  InstanceUserSummary,
  LocationInstance,
  LocationOwner
} from '@shared/definition/vrchat-instances'
import type { VRChatLogWatcher } from '../vrchat-log-watcher'
import type { VRChatUsers } from '../vrchat-users'
import type { VRChatWorlds } from '../vrchat-worlds'
import type { VRChatGroups } from '../vrchat-groups'
import type { LoggerFactory } from '@main/logger'
import type { WorldDetail } from '@shared/definition/vrchat-worlds'
import type { InstanceFetcher } from './fetcher'
import type { InstanceRepository } from './repository'
import type { InstanceUser, InstanceUserActivity } from '@shared/definition/vrchat-instances'
import type {
  LogEventContext,
  LogEventMessage,
  LogEventPlayerActivity,
  LogEventSelfJoin,
  LogEventSummary
} from '../vrchat-log-watcher/types'

interface InstanceData {
  location: LocationInstance
  joinedAt: Date | null
  leftAt: Date | null
  isLeft: boolean
  isCurrentUserInInstance: boolean
  users: InstanceUser[]
  userActivities: InstanceUserActivity[]
}

export class CurrentInstance extends Nanobus<{
  'instance:left': () => void
  'instance:joined': (location: LocationInstance) => void
  'instance:world-summary-initialized': (detail: WorldDetail | null) => void
  'instance:owner-summary-initialized': (detail: LocationOwner | null) => void
  'instance:present-progress': (
    users: InstanceUserSummary[],
    activities: InstanceUserActivitySummary[]
  ) => void
  'user:joined': (user: InstanceUserSummary) => void
  'user:left': (userId: string) => void
  'user:activity': (activity: InstanceUserActivitySummary) => void
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
    private readonly logger: LoggerFactory,
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

    this.on('instance:joined', (location) => {
      this.logger.info(`Joined instance:`, location.location)
    })

    this.on('instance:left', () => {
      this.logger.info('Left instance')
    })

    this.on('instance:world-summary-initialized', (summary) => {
      this.logger.info(
        `World summary initialized:`,
        `${summary?.worldName || 'Unknown'}(${this.repository.State.currentInstance.location?.location})`
      )
    })

    this.on('instance:present-progress', (users) => {
      this.logger.info(
        'Users in instance:',
        users.map((user) => `${user.userName}(${user.userId})`).join(',')
      )
    })

    this.on('user:joined', (user) => {
      this.logger.info('User joined:', `${user.userName}(${user.userId})`)
    })

    this.on('user:left', (userId) => {
      this.logger.info('User left:', userId)
    })

    this.on('user:activity', (activity) => {
      this.logger.info(
        'User activity:',
        `${activity.userName}(${activity.userId}) - ${activity.type}`
      )
    })
  }

  public async start() {
    if (this.isListening && this.isPending) {
      return
    }

    return this.listen()
  }

  public async stop() {
    this.isListening = false
    this.clearState()
    this.repository.clearCurrentInstance()
    await this.resetInitialBatchTimer.cancel()
  }

  private async listen() {
    this.isPending = true
    this.isListening = true

    const latestInstance = await this.getLatestInstance()
    if (latestInstance && !latestInstance.isLeft) {
      await this.initializeInstance(latestInstance)
    }

    this.isPending = false
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
        case LogEvents.PlayerLeft: {
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

    return location
      ? {
          location,
          joinedAt,
          leftAt,
          isLeft,
          ...this.parseUsersEvents(events)
        }
      : null
  }

  private parseUsersEvents(events: LogEventSummary[]) {
    const users = new Map<string, InstanceUser>()
    const userActivities: InstanceUserActivity[] = []
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

            userActivities.push({
              userId: event.data.content.userId,
              userName: event.data.content.userName,
              type: isCurrentUserInInstance
                ? InstanceUserActivityType.Join
                : InstanceUserActivityType.Present,
              recordedAt: event.context.date
            })
          }
          break
        }
        case LogEvents.PlayerLeft: {
          if (event.data.content.userId) {
            users.delete(event.data.content.userId)
            userActivities.push({
              userId: event.data.content.userId,
              userName: event.data.content.userName,
              type: InstanceUserActivityType.Leave,
              recordedAt: event.context.date
            })
          }
          break
        }
      }
    }

    return {
      users: [...users.values()],
      userActivities,
      isCurrentUserInInstance
    }
  }

  private async initializeInstance(instance: InstanceData): Promise<void> {
    const { location, users, userActivities, joinedAt } = instance

    this.repository.setCurrentInstanceLoading(true)
    this.repository.setCurrentInstanceLocation(location, joinedAt)
    this.repository.setCurrentInstanceJoined(true)

    await this.processWorldSummary(location.worldId)
    await this.processWorldOwner(location)
    await this.processInitialUsers(users, userActivities)

    this.isCurrentUserInInstance = instance.isCurrentUserInInstance
    this.repository.setCurrentInstanceLoading(false)
  }

  private async processWorldSummary(worldId: string) {
    const detail = await this.world.Fetcher.fetchWorld(worldId, {
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
          summary: await this.users.Fetcher.fetchUserSummary(location.userId)
        }
        break
      }
      case LocationInstanceGroupType.Group:
      case LocationInstanceGroupType.GroupPlus:
      case LocationInstanceGroupType.GroupPublic: {
        owner = {
          type: 'group',
          summary: await this.group.Fetcher.fetchGroupSummary(location.groupId)
        }
        break
      }
    }

    this.repository.setCurrentInstanceLocationOwner(owner)
    this.emit('instance:owner-summary-initialized', owner)
  }

  private async processInitialUsers(users: InstanceUser[], activities: InstanceUserActivity[]) {
    // preset null user to avoid flickering
    this.repository.upsertCurrentInstanceUser(users.map((u) => ({ ...u, user: null })))

    // fetch users and activities
    const { usersSummaries, activitiesSummaries } = await this.fetcher.fetchInstancePresent(
      users,
      activities,
      (users, activities) => {
        this.repository.upsertCurrentInstanceUser(users)
        this.emit('instance:present-progress', users, activities)
      }
    )

    this.repository.upsertCurrentInstanceUser(usersSummaries)
    this.repository.appendCurrentInstanceUserActivity(activitiesSummaries)
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

    const { users, userActivities, isCurrentUserInInstance } = this.parseUsersEvents(
      this.initialEvents
    )

    await this.processInitialUsers(users, userActivities)

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
    }
  }

  private async handleSelfJoin(data: LogEventSelfJoin, context: LogEventContext) {
    const location = parseLocation(data.location)
    if (!location) {
      return
    }

    this.isInitialBatchMode = true
    this.isCurrentUserInInstance = false
    this.isPending = false

    this.repository.clearCurrentInstance()
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

    const userInformation = await this.users.Fetcher.fetchUser(user.userId)
    const userSummary = userInformation ? toUserInformationSummary(userInformation) : null

    if (this.isCurrentUser(user.userId)) {
      this.isCurrentUserInInstance = true
    }

    const roomUserSummary = {
      ...user,
      joinedAt: context.date,
      user: userInformation
    }

    const activityUserSummary = {
      ...user,
      userSummary: userSummary,
      recordedAt: context.date,
      type: this.isCurrentUserInInstance
        ? InstanceUserActivityType.Join
        : InstanceUserActivityType.Present
    }

    this.repository.upsertCurrentInstanceUser(roomUserSummary)
    this.repository.appendCurrentInstanceUserActivity(activityUserSummary)
    this.emit('user:joined', roomUserSummary)
    this.emit('user:activity', activityUserSummary)
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
    const summary = await this.users.Fetcher.fetchUserSummary(user.userId)
    const activitySummary = {
      ...user,
      userSummary: summary || null,
      recordedAt: context.date,
      type:
        this.isJoined || this.isCurrentUser(user.userId)
          ? InstanceUserActivityType.Leave
          : InstanceUserActivityType.Remain
    }

    this.repository.removeCurrentInstanceUser(user.userId)
    this.repository.appendCurrentInstanceUserActivity(activitySummary)
    this.emit('user:left', user.userId)
    this.emit('user:activity', activitySummary)
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

  public get location(): LocationInstance | null {
    return this.repository.State.currentInstance.location
  }
}
