import type { VRChatUsers } from '../vrchat-users'
import type { InstancePresentProcessHandler } from './types'
import type {
  InstanceUser,
  InstanceUserActivity,
  InstanceUserActivitySummary
} from '@shared/definition/vrchat-instances'
import type { LoggerFactory } from '@main/logger'
import { toUserInformationSummary } from '../vrchat-users/factory'

export class InstanceFetcher {
  constructor(
    private readonly logger: LoggerFactory,
    private readonly users: VRChatUsers
  ) {}

  public async fetchInstancePresent(
    users: InstanceUser[],
    activities: InstanceUserActivity[],
    processHandler?: InstancePresentProcessHandler
  ) {
    const userMap = new Map<string, InstanceUser>()
    const activityMap = new Map<string, InstanceUserActivity>()

    for (const user of users) {
      userMap.set(user.userId, user)
    }

    for (const activity of activities) {
      activityMap.set(activity.userId, activity)
    }

    const roomUsers = await this.users.Fetcher.fetchUsers(
      users.map((user) => user.userId),
      (user) => {
        const instanceUser = userMap.get(user.userId)
        if (instanceUser && processHandler) {
          const summary = {
            ...instanceUser,
            user
          }

          this.logger.debug('Instance User Fetched:', user.displayName, user.userId)
          processHandler([summary], [])
        }
      }
    )

    const activitiesUserIds = activities.map((activity) => activity.userId)
    const activitiesQueueUserIds = activitiesUserIds.filter((id) => !roomUsers.has(id))
    const activitiesUsers = await this.users.Fetcher.fetchUserSummaries(
      activitiesQueueUserIds,
      false,
      (users) => {
        const summaries: InstanceUserActivitySummary[] = []
        for (const user of users) {
          const activity = activityMap.get(user.userId)
          if (activity) {
            summaries.push({
              ...activity,
              userSummary: user
            })
          }
        }

        if (summaries.length > 0 && processHandler) {
          this.logger.debug(
            'Instance Activities Users Fetched:',
            summaries.map((s) => s.userSummary?.displayName).join(', ')
          )
          processHandler([], summaries)
        }
      }
    )

    for (const userId of activitiesUserIds) {
      if (!activitiesUsers.has(userId) && roomUsers.has(userId)) {
        const user = roomUsers.get(userId)!
        const entity = toUserInformationSummary(user)
        activitiesUsers.set(userId, entity)
      }
    }

    const usersSummaries = users.map((user) => ({
      ...user,
      user: roomUsers.get(user.userId) || null
    }))

    const activitiesSummaries = activities.map((activity) => ({
      ...activity,
      userSummary: activitiesUsers.get(activity.userId) || null
    }))

    return {
      usersSummaries,
      activitiesSummaries
    }
  }
}
