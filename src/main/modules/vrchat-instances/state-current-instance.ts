import { debounce } from 'lodash'
import { parseLocation } from '../vrchat-worlds/location-parser'
import { LogEvents } from '../vrchat-log-watcher/types'
import { INSTANCE_USERS_INITIAL_BATCH_DELAY } from './constants'
import type { LocationInstance } from '@shared/definition/vrchat-instances'
import type { VRChatLogWatcher } from '../vrchat-log-watcher'
import type { VRChatUsers } from '../vrchat-users'
import type { VRChatWorlds } from '../vrchat-worlds'
import type { LoggerFactory } from '@main/logger'
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

export class CurrentInstance {
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
    private readonly logWatcher: VRChatLogWatcher,
    private readonly users: VRChatUsers,
    private readonly world: VRChatWorlds
  ) {}

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
              type: isCurrentUserInInstance ? 'join' : 'present',
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
              type: 'leave',
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

    await this.processWorldSummary(location.worldId)
    await this.processInitialUsers(users, userActivities)

    this.isCurrentUserInInstance = instance.isCurrentUserInInstance
    this.repository.setCurrentInstanceLoading(false)

    this.logger.info(
      'Users in instance:',
      users.map((user) => `${user.userName}(${user.userId})`).join(',')
    )
  }

  private async processWorldSummary(worldId: string) {
    const summary = await this.world.Fetcher.fetchWorldEntities(worldId)
    await this.repository.setCurrentInstanceWorldSummary(summary)
  }

  private async processInitialUsers(
    users: InstanceUser[],
    activities: InstanceUserActivity[]
  ): Promise<void> {
    const userIds = activities.map((activity) => activity.userId)
    const fetchedUsers = await this.users.Fetcher.fetchUserEntities(userIds)

    this.repository.appendCurrentInstanceUser(
      users.map((user) => ({
        ...user,
        userSummary: fetchedUsers.get(user.userId) || null
      }))
    )

    this.repository.appendCurrentInstanceUserActivity(
      activities.map((activity) => ({
        ...activity,
        userSummary: fetchedUsers.get(activity.userId) || null
      }))
    )
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
    this.logger.info(
      'Users in instance:',
      users.map((user) => `${user.userName}(${user.userId})`).join(',')
    )
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
    this.repository.setCurrentInstanceLoading(true)
    this.repository.setCurrentInstanceLocation(location, context.date)

    await this.processWorldSummary(location.worldId)

    this.logger.info(
      `Joined instance:`,
      `${this.repository.State.currentInstance.worldSummary?.worldName || 'Unknown'}(${data.location})`
    )
  }

  private async handleSelfLeave() {
    this.clearState()
    this.repository.clearCurrentInstance()
    this.logger.info('Left current instance')
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
    const summary = await this.users.Fetcher.fetchUserEntities(user.userId)

    if (this.isCurrentUser(user.userId)) {
      this.isCurrentUserInInstance = true
    }

    this.repository.appendCurrentInstanceUser({
      ...user,
      joinedAt: context.date,
      userSummary: summary
    })

    this.repository.appendCurrentInstanceUserActivity({
      ...user,
      userSummary: summary,
      type: this.isCurrentUserInInstance ? 'join' : 'present',
      recordedAt: context.date
    })

    this.logger.info('User joined:', `${user.userName}(${user.userId})`)
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
    const summary = await this.users.Fetcher.fetchUserEntities(user.userId)

    this.repository.removeCurrentInstanceUser(user.userId)
    this.repository.appendCurrentInstanceUserActivity({
      ...user,
      userSummary: summary || null,
      type: 'leave',
      recordedAt: context.date
    })
  }

  private clearState() {
    this.isInitialBatchMode = false
    this.isPending = false
    this.isCurrentUserInInstance = false
  }

  private isCurrentUser(userId: string): boolean {
    return this.users.currentUser?.userId === userId
  }
}
