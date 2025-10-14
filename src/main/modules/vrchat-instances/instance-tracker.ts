import Nanobus from 'nanobus'
import { RequestQueue } from '@shared/utils/async'
import { generateEventId, generateRecordId } from './utils'
import { parseLocation } from '../vrchat-worlds/location-parser'
import { toUserInformationSummary } from '../vrchat-users/factory'
import { parseInstanceFromEventLogs } from './factory'
import { CURRENT_INSTANCE_LOG_EVENTS_LIMIT, CURRENT_INSTANCE_USER_QUEUE_LIMIT } from './constants'
import { InstanceTrackerSharedState } from '@shared/definition/mobx-shared'
import {
  LogEventContext,
  LogEventMessage,
  LogEventPlayerActivity,
  LogEvents,
  LogEventSelfJoin
} from '../vrchat-game-process/types'
import {
  InstanceAccessCategory,
  InstanceEvents,
  InstanceEventUser,
  LocationInstanceGroupType,
  LocationInstancePublicType,
  LocationInstanceUserType
} from '@shared/definition/vrchat-instances'
import type { UserEntity } from '../database/entities/vrchat-cache-users'
import type { MobxState } from '../mobx-state'
import type { VRChatGameProcess } from '../vrchat-game-process'
import type { VRChatUsers } from '../vrchat-users'
import type { VRChatWorlds } from '../vrchat-worlds'
import type { VRChatGroups } from '../vrchat-groups'
import type {
  InstanceEventMessage,
  InstanceUserWithInformation,
  InstanceOwner,
  LocationInstance
} from '@shared/definition/vrchat-instances'
import type { WorldDetail } from '@shared/definition/vrchat-worlds'
import type { LogInstanceSummary } from './types'

export class InstanceTracker extends Nanobus<{
  'instance:clear': () => void
  'instance:joined': (recordId: string, location: LocationInstance, joinedAt: Date) => void
  'instance:initialization-complete': (
    recordId: string,
    location: LocationInstance,
    world: WorldDetail | null,
    owner: InstanceOwner | null,
    joinedAt: Date
  ) => void
  'instance:left': (recordId: string, leftAt: Date) => void
  'instance:player-joined': (recordId: string, users: InstanceUserWithInformation[]) => void
  'instance:player-patch': (
    recordId: string,
    userId: string,
    user: InstanceUserWithInformation
  ) => void
  'instance:player-left': (recordId: string, userId: string) => void
  'instance:event': (recordId: string, events: InstanceEventMessage[]) => void
  'instance:event-patch': (recordId: string, eventId: string, event: InstanceEventMessage) => void
}> {
  private players = new Map<string, InstanceUserWithInformation>()
  private events = new Map<string, InstanceEventMessage>()
  private state!: InstanceTrackerSharedState
  private isListening = false
  private bindingUserId: string | null = null

  // query pool
  private _requestQueue = new RequestQueue(CURRENT_INSTANCE_USER_QUEUE_LIMIT)

  constructor(
    private readonly gameProcess: VRChatGameProcess,
    private readonly mobx: MobxState,
    private readonly users: VRChatUsers,
    private readonly world: VRChatWorlds,
    private readonly group: VRChatGroups
  ) {
    super('VRChatInstances:InstanceTracker')
    this.bindEvents()
    this.state = this.mobx.observable(
      'VRChatInstances:InstanceTracker',
      {
        recordId: null,
        isRunning: false,
        isInitializing: false,
        isInInstance: false,
        isJoined: false,
        worldDetail: null,
        ownerDetail: null,
        locationInstance: null,
        locationJoinedAt: null
      },
      [
        'recordId',
        'isRunning',
        'isInitializing',
        'isInInstance',
        'isJoined',
        'worldDetail',
        'ownerDetail',
        'locationInstance',
        'locationJoinedAt'
      ]
    )
  }

  public async loginAs(userId: string, ignoreLatestInstance = false) {
    if (this.isListening) {
      return
    }

    this.bindingUserId = userId
    this.mobx.action(() => {
      this.state.isRunning = true
    })

    const logs = await this.resolveLatestInstanceEvents()
    const currentInstance = parseInstanceFromEventLogs(logs.toReversed(), userId)

    if (currentInstance && currentInstance.isInInstance && !ignoreLatestInstance) {
      this.applyLogInstanceSummary(currentInstance)

      // resume
      this.isListening = true
      this.resumeInstanceInformation(currentInstance)
      this.resumeInstanceEvents(currentInstance)
    } else {
      this.isListening = true
    }
  }

  public logout(exitWithGame = false) {
    if (exitWithGame) {
      this.handleGameExit()
    }

    this.players.clear()
    this.events.clear()
    this.emit('instance:clear')

    this.bindingUserId = null
    this.isListening = false
    this.mobx.action(() => {
      this.state.recordId = null
      this.state.locationInstance = null
      this.state.locationJoinedAt = null
      this.state.worldDetail = null
      this.state.ownerDetail = null
      this.state.isRunning = false
      this.state.isInitializing = false
      this.state.isInInstance = false
      this.state.isJoined = false
    })
  }

  private bindEvents() {
    this.gameProcess.on('game:event', (data, context) => {
      if (!this.isListening) {
        return
      }

      this.handleMessage(data, context)
    })
  }

  private applyLogInstanceSummary(instance: LogInstanceSummary) {
    const locationInstance = instance.locationInstance
    const recordId = instance.recordId

    this.mobx.action(() => {
      this.state.recordId = instance.recordId
      this.state.locationInstance = instance.locationInstance
      this.state.locationJoinedAt = instance.joinedAt
      this.state.isJoined = instance.isJoined
      this.state.isInInstance = instance.isInInstance
      this.state.isInitializing = true
    })

    for (const player of instance.players) {
      this.players.set(player.userId, { ...player, user: null })
    }

    for (const event of instance.events) {
      this.events.set(event.eventId, event)
    }

    const players: InstanceUserWithInformation[] = [...instance.players.values()].map((player) => ({
      ...player,
      user: null
    }))

    this.emit('instance:joined', recordId, locationInstance, instance.joinedAt)
    this.emit('instance:player-joined', recordId, [...players])
    this.emit('instance:event', recordId, [...instance.events.values()])
  }

  private async resumeInstanceInformation(instance: LogInstanceSummary) {
    const locationInstance = instance.locationInstance
    const recordId = instance.recordId
    const [world, owner] = await Promise.all([
      this.getWorldFromLocation(locationInstance),
      this.getOwnerFromLocation(locationInstance)
    ])

    if (recordId !== this.state.recordId) {
      return
    }

    this.mobx.action(() => {
      this.state.worldDetail = world
      this.state.ownerDetail = owner
      this.state.isInitializing = false
    })

    this.emit(
      'instance:initialization-complete',
      recordId,
      locationInstance,
      world,
      owner,
      instance.joinedAt
    )
  }

  private async resumeInstanceEvents(instance: LogInstanceSummary) {
    const presentUserIds = instance.players.map((player) => player.userId)
    const eventUserIds = instance.events
      .filter((event) => 'userId' in event.content)
      .map((event) => event.content as InstanceEventUser)
      .map((content) => content.userId)

    await this.users.fetchUsers(presentUserIds, (user) => {
      const instanceUser = this.players.get(user.userId)
      if (instanceUser) {
        instanceUser.user = user
        this.emit('instance:player-patch', instance.recordId, instanceUser.userId, instanceUser)
      }
    })

    await this.users.fetchUserSummaries(eventUserIds, false, (users) => {
      const userMap = new Map<string, UserEntity>()

      for (const user of users) {
        userMap.set(user.userId, user)
      }

      for (const event of instance.events) {
        switch (event.type) {
          case InstanceEvents.UserJoin:
          case InstanceEvents.UserLeave:
          case InstanceEvents.UserPresent:
          case InstanceEvents.UserRemain: {
            const user = userMap.get(event.content.userId)
            if (user) {
              event.content.user = user
              this.emit('instance:event-patch', instance.recordId, event.eventId, event)
            }
            break
          }
        }
      }
    })
  }

  private async handleMessage(data: LogEventMessage, context: LogEventContext) {
    switch (data.type) {
      case LogEvents.SelfJoin: {
        await this.handleSelfJoin(data.content, context)
        break
      }
      case LogEvents.SelfLeave: {
        await this.handleSelfLeave(context)
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

    const recordId = generateRecordId(location.worldId, location.name, context.date)

    this.players.clear()
    this.events.clear()
    this.emit('instance:clear')

    this.mobx.action(() => {
      this.state.worldDetail = null
      this.state.ownerDetail = null
      this.state.recordId = recordId
      this.state.locationJoinedAt = context.date
      this.state.locationInstance = location
      this.state.isInitializing = true
      this.state.isInInstance = true
      this.state.isJoined = false
    })

    this.emit('instance:joined', recordId, location, context.date)

    const [world, owner] = await Promise.all([
      this.getWorldFromLocation(location),
      this.getOwnerFromLocation(location)
    ])

    if (recordId !== this.state.recordId) {
      return
    }

    this.mobx.action(() => {
      this.state.worldDetail = world
      this.state.ownerDetail = owner
      this.state.isInitializing = false
    })

    this.emit('instance:initialization-complete', recordId, location, world, owner, context.date)
  }

  private async handleSelfLeave(context: LogEventContext) {
    const recordId = this.state.recordId

    if (!recordId) {
      return
    }

    this.mobx.action(() => {
      this.state.isInitializing = false
      this.state.isInInstance = false
      this.state.isJoined = false
    })

    this.emit('instance:left', recordId, context.date)
  }

  private async handlePlayerJoined(data: LogEventPlayerActivity, context: LogEventContext) {
    const recordId = this.state.recordId

    if (!recordId) {
      return
    }

    if (this.isCurrentUser(data.userId)) {
      this.mobx.action(() => {
        this.state.isJoined = true
      })
    }

    const eventType =
      this.isCurrentUser(data.userId) || this.state.isJoined
        ? InstanceEvents.UserJoin
        : InstanceEvents.UserPresent

    const eventId = generateEventId(recordId, eventType, data.userId, context.date)
    const user: InstanceUserWithInformation = {
      userId: data.userId,
      userName: data.userName,
      user: null,
      joinedAt: context.date
    }

    const eventContent: InstanceEventUser = {
      userName: data.userName,
      userId: data.userId,
      user: null
    }

    const event: InstanceEventMessage = {
      eventId,
      type: eventType,
      recordedAt: context.date,
      content: eventContent
    }

    const patcher = (patch?: boolean) => {
      if (patch) {
        this.emit('instance:player-patch', recordId, user.userId, user)
        this.emit('instance:event-patch', recordId, eventId, event)
      } else {
        this.emit('instance:player-joined', recordId, [user])
        this.emit('instance:event', recordId, [event])
      }
    }

    this.players.set(data.userId, user)
    this.events.set(eventId, event)
    patcher()

    const information = await this._requestQueue.add(() => this.users.fetchUser(user.userId))
    const summary = information ? toUserInformationSummary(information) : null
    user.user = information
    eventContent.user = summary
    patcher(true)
  }

  private async handlePlayerLeft(data: LogEventPlayerActivity, context: LogEventContext) {
    const recordId = this.state.recordId

    if (!recordId) {
      return
    }

    const eventType =
      this.isCurrentUser(data.userId) || this.state.isJoined
        ? InstanceEvents.UserLeave
        : InstanceEvents.UserRemain

    const eventId = generateEventId(recordId, eventType, data.userId, context.date)
    const eventContent: InstanceEventUser = {
      userName: data.userName,
      userId: data.userId,
      user: null
    }

    const event: InstanceEventMessage = {
      eventId,
      type: eventType,
      recordedAt: context.date,
      content: eventContent
    }

    const patcher = (patch?: boolean) => {
      if (patch) {
        this.emit('instance:event-patch', recordId, eventId, event)
      } else {
        this.emit('instance:event', recordId, [event])
      }
    }

    this.players.delete(data.userId)
    this.events.set(eventId, event)
    this.emit('instance:player-left', recordId, data.userId)
    patcher()

    const summary = await this._requestQueue.add(() => this.users.fetchUserSummary(data.userId!))
    eventContent.user = summary
    patcher(true)
  }

  private async handleVideoPlaybackLoad(url: string, context: LogEventContext) {
    const recordId = this.state.recordId

    if (!recordId) {
      return
    }

    const eventId = generateEventId(recordId, InstanceEvents.UserLeave, url, context.date)
    const event: InstanceEventMessage = {
      eventId,
      type: InstanceEvents.VideoPlaybackLoad,
      recordedAt: context.date,
      content: {
        url
      }
    }

    this.events.set(eventId, event)
    this.emit('instance:event', recordId, [event])
  }

  private async handleVideoPlaybackError(reason: string, context: LogEventContext) {
    const recordId = this.state.recordId

    if (!recordId) {
      return
    }

    const eventId = generateEventId(recordId, InstanceEvents.UserLeave, reason, context.date)
    const event: InstanceEventMessage = {
      eventId,
      type: InstanceEvents.VideoPlaybackError,
      recordedAt: context.date,
      content: {
        reason
      }
    }

    this.events.set(eventId, event)
    this.emit('instance:event', recordId, [event])
  }

  private async handleVoteKick(userName: string, context: LogEventContext) {
    const recordId = this.state.recordId

    if (!recordId) {
      return
    }

    const eventId = generateEventId(recordId, InstanceEvents.VoteKick, userName, context.date)
    const event: InstanceEventMessage = {
      eventId,
      type: InstanceEvents.VoteKick,
      recordedAt: context.date,
      content: {
        userName
      }
    }

    this.events.set(eventId, event)
    this.emit('instance:event', recordId, [event])
  }

  private resolveLatestInstanceEvents() {
    return this.gameProcess.resolveBackwardEvents(
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
          case LogEvents.SelfJoin:
          case LogEvents.UserAuthenticated:
          case LogEvents.UserLoggedOut: {
            signal.stop(true)
            break
          }
        }

        return false
      }
    )
  }

  private async getOwnerFromLocation(location: LocationInstance): Promise<InstanceOwner | null> {
    let owner: InstanceOwner | null = null
    switch (location.type) {
      case LocationInstancePublicType.Public: {
        owner = {
          type: InstanceAccessCategory.Public,
          summary: null
        }
        break
      }
      case LocationInstanceUserType.Friends:
      case LocationInstanceUserType.FriendsPlus:
      case LocationInstanceUserType.Invite:
      case LocationInstanceUserType.InvitePlus: {
        owner = {
          type: InstanceAccessCategory.Friend,
          summary: await this.users.fetchUserSummary(location.userId)
        }
        break
      }
      case LocationInstanceGroupType.Group:
      case LocationInstanceGroupType.GroupPlus:
      case LocationInstanceGroupType.GroupPublic: {
        owner = {
          type: InstanceAccessCategory.Group,
          summary: await this.group.fetchGroupSummary(location.groupId)
        }
        break
      }
    }

    return owner
  }

  private handleGameExit() {
    const recordId = this.state.recordId
    if (!recordId) {
      return
    }

    const date = new Date()
    const remainPlayers = [...this.players.values()]
    const events = remainPlayers.map((player) => {
      const eventType = this.isCurrentUser(player.userId)
        ? InstanceEvents.UserLeave
        : InstanceEvents.UserRemain

      const eventId = generateEventId(recordId, eventType, player.userId, date)
      const eventContent: InstanceEventUser = {
        userName: player.userName,
        userId: player.userId,
        user: player.user
      }

      return {
        eventId,
        type: eventType,
        recordedAt: date,
        content: eventContent
      }
    })

    this.emit('instance:event', recordId, events)
    this.emit('instance:left', recordId, date)
  }

  private getWorldFromLocation(location: LocationInstance): Promise<WorldDetail | null> {
    return this.world.fetchWorld(location.worldId, {
      ignoreInstances: true
    })
  }

  private isCurrentUser(userId: string): boolean {
    return this.bindingUserId === userId
  }

  public get instance() {
    return this.state.isInInstance && this.state.locationInstance && this.state.locationJoinedAt
      ? {
          location: this.state.locationInstance,
          joinedAt: this.state.locationJoinedAt
        }
      : null
  }

  public get instanceFullDetail() {
    return this.instance
      ? {
          ...this.instance,
          world: this.state.worldDetail,
          owner: this.state.ownerDetail
        }
      : null
  }

  public get currentPlayers() {
    return [...this.players.values()]
  }

  public get currentEvents() {
    return [...this.events.values()]
  }

  public get currentUserId() {
    return this.bindingUserId
  }
}
