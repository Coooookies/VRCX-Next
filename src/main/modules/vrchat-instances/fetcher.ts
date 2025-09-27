import type { VRChatUsers } from '../vrchat-users'
import type { InstancePresentProcessHandler, InstanceUserPresentEvent } from './types'
import type { InstanceEventMessage, InstanceUser } from '@shared/definition/vrchat-instances'
import { toUserInformationSummary } from '../vrchat-users/factory'

export class InstanceFetcher {
  constructor(private readonly users: VRChatUsers) {}

  public async fetchInstancePresent(
    users: InstanceUser[],
    userEvents: InstanceUserPresentEvent[],
    processHandler?: InstancePresentProcessHandler
  ) {
    const userMap = new Map<string, InstanceUser>()
    const userEventMap = new Map<string, InstanceUserPresentEvent>()

    for (const user of users) {
      userMap.set(user.userId, user)
    }

    for (const event of userEvents) {
      userEventMap.set(event.userId, event)
    }

    const roomUsers = await this.users.fetchUsers(
      users.map((user) => user.userId),
      (user) => {
        const instanceUser = userMap.get(user.userId)
        if (instanceUser && processHandler) {
          const summary = {
            ...instanceUser,
            user
          }

          processHandler([summary], [])
        }
      }
    )

    const eventUserIds = [...userEventMap.keys()]
    const eventQueueUserIds = eventUserIds.filter((id) => !roomUsers.has(id))
    const eventUsers = await this.users.fetchUserSummaries(eventQueueUserIds, false, (users) => {
      const events: InstanceEventMessage[] = []

      for (const user of users) {
        const event = userEventMap.get(user.userId)
        if (event) {
          events.push({
            type: event.type,
            recordedAt: event.recordedAt,
            content: {
              userId: event.userId,
              userName: event.userName,
              userSummary: user
            }
          })
        }
      }

      if (events.length > 0 && processHandler) {
        processHandler([], events)
      }
    })

    for (const userId of eventUserIds) {
      if (roomUsers.has(userId)) {
        const user = roomUsers.get(userId)!
        const entity = toUserInformationSummary(user)
        eventUsers.set(userId, entity)
      }
    }

    const usersSummaries = users.map((user) => ({
      ...user,
      user: roomUsers.get(user.userId) || null
    }))

    const presentEvents = userEvents.map<InstanceEventMessage>((event) => ({
      type: event.type,
      recordedAt: event.recordedAt,
      content: {
        userId: event.userId,
        userName: event.userName,
        userSummary: eventUsers.get(event.userId) || null
      }
    }))

    return {
      usersSummaries,
      presentEvents
    }
  }
}
