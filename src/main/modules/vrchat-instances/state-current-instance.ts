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

export class CurrentInstance {
  private isListening = false
  private isInitialBatchMode = false
  private isPending = false
  private pendingInitialUsers = new Map<string, InstanceUser>()
  private pendingInitialEvents: LogEventSummary[] = []

  constructor(
    private readonly logger: LoggerFactory,
    private readonly repository: InstanceRepository,
    private readonly logWatcher: VRChatLogWatcher,
    private readonly users: VRChatUsers,
    private readonly world: VRChatWorlds
  ) {}

  private resetInitialBatchTimer = debounce(() => {
    this.processInitialBatchEvents()
  }, INSTANCE_USERS_INITIAL_BATCH_DELAY)

  public bindEvents() {
    this.logWatcher.on('message', (data, context) => {
      if (!this.isListening) {
        return
      }

      if (this.isPending) {
        this.pendingInitialEvents.push({ data, context })
        return
      }

      this.handleMessage(data, context)
    })
  }

  public async listen() {
    if (this.isListening && this.isPending) {
      return
    }

    return this.start()
  }

  public async start() {
    this.isPending = true
    this.isListening = true

    const latestInstance = await this.getLatestInstance()
    if (latestInstance) {
      const worldId = latestInstance.location.worldId
      const location = latestInstance.location
      const pendingUsers = latestInstance.users
      const activities = latestInstance.userActivities

      this.repository.setCurrentInstanceLoading(true)
      this.repository.setCurrentInstanceLocation(location, latestInstance.joinedAt)

      const summary = await this.world.Fetcher.fetchWorldEntities(worldId)
      await this.initialUsers(pendingUsers)

      this.repository.setCurrentInstanceWorldSummary(summary)
      this.repository.setCurrentInstanceLoading(false)
      this.repository.appendCurrentInstanceUserActivity(activities)
      this.logger.info(
        'Users in instance:',
        pendingUsers.map((user) => `${user.userName}(${user.userId})`).join(',')
      )
    }

    this.isPending = false
    this.processPendingInitialEvents()
  }

  public async stop() {
    this.isListening = false
    await this.resetInitialBatchTimer.cancel()
  }

  private async getLatestInstance() {
    const events = await this.resolveLatestInstanceEvents()
    const reverseEvents = events.reverse()
    const users = new Map<string, InstanceUser>()
    const userActivities: InstanceUserActivity[] = []

    let location: LocationInstance | null = null
    let joinedAt: Date | null = null
    let leftAt: Date | null = null
    let isLeft = false

    for (const event of reverseEvents) {
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
        case LogEvents.PlayerJoined: {
          if (event.data.content.userId) {
            users.set(event.data.content.userId, {
              userId: event.data.content.userId,
              userName: event.data.content.userName,
              joinedAt: event.context.date
            })

            userActivities.push({
              userId: event.data.content.userId,
              userName: event.data.content.userName,
              type: 'join',
              at: event.context.date
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
              at: event.context.date
            })
          }
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
          users: [...users.values()],
          userActivities
        }
      : null
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

  private async initialUsers(users: InstanceUser[]) {
    const userIds = users.map((u) => u.userId)
    const fetchedUsers = await this.users.Fetcher.fetchUserEntities(userIds)
    this.repository.appendCurrentInstanceUser(
      users.map((currentUser) => {
        const user = fetchedUsers.get(currentUser.userId)
        return {
          ...currentUser,
          userSummary: user || null
        }
      })
    )
  }

  private async processPendingInitialEvents() {
    for (const event of this.pendingInitialEvents) {
      await this.handleMessage(event.data, event.context)
    }

    this.pendingInitialEvents = []
  }

  private async processInitialBatchEvents() {
    this.isInitialBatchMode = false
    this.isPending = true

    const pendingUsers = [...this.pendingInitialUsers.values()]
    const userIds = pendingUsers.map((u) => u.userId)
    const users = await this.users.Fetcher.fetchUserEntities([...userIds])
    await this.initialUsers(
      pendingUsers.map((user) => ({
        ...user,
        userSummary: users.get(user.userId) || null
      }))
    )

    this.isPending = false
    this.processPendingInitialEvents()

    this.pendingInitialUsers.clear()
    this.repository.setCurrentInstanceLoading(false)
    this.logger.info(
      'Users in instance:',
      pendingUsers.map((user) => `${user.userName}(${user.userId})`).join(',')
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

    if (location) {
      this.isInitialBatchMode = true
      this.repository.setCurrentInstanceLoading(true)
      this.repository.setCurrentInstanceLocation(location, context.date)

      const summary = await this.world.Fetcher.fetchWorldEntities(location.worldId)

      this.repository.setCurrentInstanceWorldSummary(summary)
      this.logger.info(`Joined instance:`, `${summary?.worldName || 'Unknown'}(${data.location})`)
    }
  }

  private handleSelfLeave() {
    this.clear()
    this.repository.clearCurrentInstance()
    this.logger.info('Left current instance')

    return this.resetInitialBatchTimer.cancel()
  }

  private async handlePlayerJoined(data: LogEventPlayerActivity, context: LogEventContext) {
    if (!data.userId) {
      return
    }

    const user = {
      userId: data.userId,
      userName: data.userName,
      joinedAt: context.date
    }

    if (this.isInitialBatchMode) {
      this.resetInitialBatchTimer()
      this.pendingInitialUsers.set(data.userId, user)
    } else {
      const summary = await this.users.Fetcher.fetchUserEntities(data.userId)

      this.logger.info(`User joined:`, `${data.userName}(${data.userId})`)
      this.repository.appendCurrentInstanceUser({
        ...user,
        userSummary: summary
      })
    }

    this.repository.appendCurrentInstanceUserActivity({
      userId: data.userId,
      userName: data.userName,
      type: 'join',
      at: context.date
    })
  }

  private async handlePlayerLeft(data: LogEventPlayerActivity, context: LogEventContext) {
    if (!data.userId) {
      return
    }

    if (this.isInitialBatchMode) {
      this.pendingInitialUsers.delete(data.userId)
    } else {
      this.repository.removeCurrentInstanceUser(data.userId)
    }

    this.repository.appendCurrentInstanceUserActivity({
      userId: data.userId,
      userName: data.userName,
      type: 'leave',
      at: context.date
    })
  }

  private clear() {
    this.isInitialBatchMode = false
    this.pendingInitialUsers.clear()
    this.pendingInitialEvents = []
  }
}
