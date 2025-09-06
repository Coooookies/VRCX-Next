import { parseLocation } from '../vrchat-worlds/location-parser'
import { LogEvents } from '../vrchat-log-watcher/types'
import type { LocationInstance } from '@shared/definition/vrchat-instances'
import type { VRChatLogWatcher } from '../vrchat-log-watcher'
import type { VRChatUsers } from '../vrchat-users'
import type { VRChatWorlds } from '../vrchat-worlds'
import type { InstanceUser, InstanceUserActivity } from './types'

export class CurrentInstance {
  private location: LocationInstance | null = null
  private locationArrivedAt: Date | null = null

  constructor(
    private logWatcher: VRChatLogWatcher,
    private users: VRChatUsers,
    private world: VRChatWorlds
  ) {
    this.getLatestInstance().then((instance) => {
      console.log(JSON.stringify(instance, null, 2))
    })
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

  // private listen() {
  //   let isInitialBatchMode = false
  //   let currentPlayerQueue: { userId: string; userName: string }[] = []
  //   let currentLocation: LocationInstance | null = null
  //   const resetInitialBatchTimer = debounce(() => {
  //     isInitialBatchMode = false
  //     this.logger.debug(
  //       'Initial player batch:',
  //       currentPlayerQueue.length,
  //       'players in',
  //       currentLocation?.location
  //     )
  //     currentPlayerQueue.forEach((player, index) => {
  //       this.logger.debug(`player-join (queue ${index})`, player.userName, player.userId)
  //     })
  //   }, 2000)

  //   this.logWatcher.on('message', (data) => {
  //     switch (data.type) {
  //       case LogEvents.SelfJoin: {
  //         isInitialBatchMode = true
  //         currentLocation = parseLocation(data.content.location)
  //         break
  //       }
  //       case LogEvents.SelfLeave: {
  //         isInitialBatchMode = false
  //         currentPlayerQueue = []
  //         currentLocation = null
  //         break
  //       }
  //       case LogEvents.PlayerJoined: {
  //         if (isInitialBatchMode) {
  //           resetInitialBatchTimer()
  //           currentPlayerQueue.push({
  //             userId: data.content.userId!,
  //             userName: data.content.userName
  //           })
  //         } else {
  //           this.logger.debug('player-join', data.content.userName, data.content.userId)
  //         }
  //         break
  //       }
  //     }
  //   })
  // }
}
