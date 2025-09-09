import Nanobus from 'nanobus'
import type { MobxState } from '../mobx-state'
import type {
  InstanceUserActivity,
  InstanceUserActivitySummary,
  InstanceUserSummary,
  LocationInstance
} from '@shared/definition/vrchat-instances'
import type { InstanceSharedState } from '@shared/definition/mobx-shared'
import type { WorldSummary } from '@shared/definition/vrchat-worlds'

export class InstanceRepository extends Nanobus<{
  'current-instance:append-users': (users: InstanceUserSummary[]) => void
  'current-instance:append-user-activities': (activities: InstanceUserActivity[]) => void
  'current-instance:remove-users': (userId: string) => void
  'current-instance:clear-users': () => void
  'current-instance:clear-user-activities': () => void
}> {
  private $!: InstanceSharedState
  private currentInstanceUsers = new Map<string, InstanceUserSummary>()
  private currentInstanceUserActivities: InstanceUserActivitySummary[] = []

  constructor(
    moduleId: string,
    private readonly mobx: MobxState
  ) {
    super('VRChatInstances:Repository')
    this.$ = this.mobx.observable(
      moduleId,
      {
        currentInstance: {
          worldSummary: null,
          locationJoinedAt: null,
          location: null,
          loading: false
        }
      },
      [
        'currentInstance.worldSummary',
        'currentInstance.locationJoinedAt',
        'currentInstance.location',
        'currentInstance.loading'
      ]
    )
  }

  public appendCurrentInstanceUser(user: InstanceUserSummary | InstanceUserSummary[]) {
    const users = Array.isArray(user) ? user : [user]
    for (const currentUser of users) {
      this.currentInstanceUsers.set(currentUser.userId, currentUser)
    }

    this.emit('current-instance:append-users', users)
  }

  public removeCurrentInstanceUser(userId: string) {
    this.currentInstanceUsers.delete(userId)
    this.emit('current-instance:remove-users', userId)
  }

  public clearCurrentInstanceUsers() {
    this.currentInstanceUsers.clear()
    this.emit('current-instance:clear-users')
  }

  public appendCurrentInstanceUserActivity(
    activity: InstanceUserActivitySummary | InstanceUserActivitySummary[]
  ) {
    const activities = Array.isArray(activity) ? activity : [activity]
    this.currentInstanceUserActivities.push(...activities)
    this.emit('current-instance:append-user-activities', activities)
  }

  public clearCurrentInstanceUserActivities() {
    this.currentInstanceUserActivities = []
    this.emit('current-instance:clear-user-activities')
  }

  public clearCurrentInstance() {
    this.clearCurrentInstanceUsers()
    this.clearCurrentInstanceUserActivities()
    this.mobx.action(() => {
      this.$.currentInstance.worldSummary = null
      this.$.currentInstance.location = null
      this.$.currentInstance.locationJoinedAt = null
      this.$.currentInstance.loading = false
    })
  }

  public setCurrentInstanceLoading(loading: boolean) {
    this.mobx.action(() => {
      this.$.currentInstance.loading = loading
    })
  }

  public setCurrentInstanceLocation(location: LocationInstance | null, joinedAt: Date | null) {
    this.mobx.action(() => {
      this.$.currentInstance.location = location
      this.$.currentInstance.locationJoinedAt = joinedAt
    })
  }

  public setCurrentInstanceWorldSummary(summary: WorldSummary | null) {
    this.mobx.action(() => {
      this.$.currentInstance.worldSummary = summary
    })
  }

  public getCurrentInstanceUsers(): InstanceUserSummary[] {
    return [...this.currentInstanceUsers.values()]
  }

  public getCurrentInstanceUserActivities(): InstanceUserActivity[] {
    return this.currentInstanceUserActivities
  }

  public get State(): InstanceSharedState {
    return this.$
  }

  public get CurrentInstanceUsers(): InstanceUserSummary[] {
    return [...this.currentInstanceUsers.values()]
  }

  public get CurrentInstanceUserActivities(): InstanceUserActivity[] {
    return this.currentInstanceUserActivities
  }
}
