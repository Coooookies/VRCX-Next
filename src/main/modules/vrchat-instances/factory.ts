import { parseLocation } from '../vrchat-worlds/location-parser'
import { generateEventId, generateRecordId } from './utils'
import { LogEvents } from '../vrchat-log-watcher/types'
import {
  InstanceEvents,
  LocationInstanceGroupType,
  LocationInstancePublicType,
  LocationInstanceUserType
} from '@shared/definition/vrchat-instances'
import type {
  InstanceEventMessage,
  InstanceUser,
  LocationInstance
} from '@shared/definition/vrchat-instances'
import type { LogInstanceSummary } from './types'
import type { LogEventSummary } from '../vrchat-log-watcher/types'

export function parseInstanceFromEventLogs(
  logs: LogEventSummary[],
  currentUserId: string
): LogInstanceSummary | null {
  const players = new Map<string, InstanceUser>()
  const events = new Map<string, InstanceEventMessage>()

  let locationInstance: LocationInstance | null = null
  let recordId: string | null = null
  let joinedAt: Date | null = null
  let leftAt: Date | null = null

  let isJoined = false
  let isInInstance = false

  for (const event of logs) {
    switch (event.data.type) {
      case LogEvents.SelfJoin: {
        const location = parseLocation(event.data.content.location)
        if (!location) {
          break
        }

        locationInstance = location
        recordId = generateRecordId(location.worldId, location.name, event.context.date)
        isInInstance = true
        joinedAt = event.context.date
        break
      }
      case LogEvents.SelfLeave: {
        isJoined = false
        isInInstance = false
        leftAt = event.context.date
        break
      }
    }
  }

  if (recordId) {
    for (const event of logs) {
      switch (event.data.type) {
        case LogEvents.PlayerJoined: {
          const userId = event.data.content.userId
          const recordedAt = event.context.date

          if (userId === currentUserId) {
            isJoined = true
          }

          const evenType =
            userId === currentUserId || isJoined
              ? InstanceEvents.UserJoin
              : InstanceEvents.UserPresent

          const eventId = generateEventId(recordId, evenType, userId, recordedAt)

          players.set(userId, {
            userId: userId,
            userName: event.data.content.userName,
            joinedAt: recordedAt
          })

          events.set(eventId, {
            type: evenType,
            eventId,
            recordedAt,
            content: {
              userId: userId,
              userName: event.data.content.userName,
              user: null
            }
          })
          break
        }
        case LogEvents.PlayerLeft: {
          const userId = event.data.content.userId
          const recordedAt = event.context.date
          const evenType =
            userId === currentUserId || isJoined
              ? InstanceEvents.UserLeave
              : InstanceEvents.UserRemain

          const eventId = generateEventId(recordId, evenType, userId, recordedAt)
          players.delete(userId)
          events.set(eventId, {
            type: evenType,
            eventId,
            recordedAt,
            content: {
              userId,
              userName: event.data.content.userName,
              user: null
            }
          })

          break
        }
        case LogEvents.VideoPlaybackLoad: {
          const recordedAt = event.context.date
          const url = event.data.content.url
          const eventId = generateEventId(
            recordId,
            InstanceEvents.VideoPlaybackLoad,
            url,
            recordedAt
          )

          events.set(eventId, {
            type: InstanceEvents.VideoPlaybackLoad,
            eventId,
            recordedAt,
            content: {
              url
            }
          })
          break
        }
        case LogEvents.VideoPlaybackError: {
          const recordedAt = event.context.date
          const reason = event.data.content.reason
          const eventId = generateEventId(
            recordId,
            InstanceEvents.VideoPlaybackError,
            reason,
            recordedAt
          )

          events.set(eventId, {
            type: InstanceEvents.VideoPlaybackError,
            eventId,
            recordedAt,
            content: {
              reason
            }
          })
          break
        }
        case LogEvents.VoteKick: {
          const recordedAt = event.context.date
          const userName = event.data.content.userName
          const eventId = generateEventId(recordId, InstanceEvents.VoteKick, userName, recordedAt)

          events.set(eventId, {
            type: InstanceEvents.VoteKick,
            eventId,
            recordedAt,
            content: {
              userName
            }
          })
          break
        }
      }
    }
  }

  if (locationInstance && recordId && joinedAt) {
    return {
      locationInstance,
      recordId,
      joinedAt,
      leftAt,
      isJoined,
      isInInstance,
      players: [...players.values()],
      events: [...events.values()]
    }
  }

  return null
}

export function parseOwnerIdfromLocationInstance(location: LocationInstance): string | null {
  switch (location.type) {
    case LocationInstancePublicType.Public: {
      return null
    }
    case LocationInstanceUserType.Friends:
    case LocationInstanceUserType.FriendsPlus:
    case LocationInstanceUserType.Invite:
    case LocationInstanceUserType.InvitePlus: {
      return location.userId
    }
    case LocationInstanceGroupType.Group:
    case LocationInstanceGroupType.GroupPlus:
    case LocationInstanceGroupType.GroupPublic: {
      return location.groupId
    }
  }
}
