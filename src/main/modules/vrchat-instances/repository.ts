import Nanobus from 'nanobus'
import type { MobxState } from '../mobx-state'
import type {
  InstanceUserActivity,
  InstanceUserActivitySummary,
  InstanceUserSummary,
  LocationInstance,
  LocationOwner
} from '@shared/definition/vrchat-instances'
import type { InstanceSharedState } from '@shared/definition/mobx-shared'
import type { WorldDetail } from '@shared/definition/vrchat-worlds'

export class InstanceRepository extends Nanobus<{
  'current-instance:insert-users': (users: InstanceUserSummary[]) => void
  'current-instance:update-users': (users: InstanceUserSummary[]) => void
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
          recordId: null,
          joined: false,
          world: null,
          locationInstance: null,
          locationOwner: null,
          locationJoinedAt: null,
          locationPlayersInitializing: false
        }
      },
      [
        'currentInstance.recordId',
        'currentInstance.joined',
        'currentInstance.world',
        'currentInstance.locationInstance',
        'currentInstance.locationOwner',
        'currentInstance.locationJoinedAt',
        'currentInstance.locationPlayersInitializing'
      ]
    )
  }

  public upsertCurrentInstanceUser(user: InstanceUserSummary | InstanceUserSummary[]) {
    const users = Array.isArray(user) ? user : [user]
    const pendingInsertUsers: InstanceUserSummary[] = []
    const pendingUpdateUsers: InstanceUserSummary[] = []

    for (const currentUser of users) {
      if (this.currentInstanceUsers.has(currentUser.userId)) {
        pendingUpdateUsers.push(currentUser)
      } else {
        pendingInsertUsers.push(currentUser)
      }

      this.currentInstanceUsers.set(currentUser.userId, currentUser)
    }

    if (pendingInsertUsers.length > 0) {
      this.emit('current-instance:insert-users', pendingInsertUsers)
    }

    if (pendingUpdateUsers.length > 0) {
      this.emit('current-instance:update-users', pendingUpdateUsers)
    }
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
      this.$.currentInstance.recordId = null
      this.$.currentInstance.joined = false
      this.$.currentInstance.world = null
      this.$.currentInstance.locationInstance = null
      this.$.currentInstance.locationOwner = null
      this.$.currentInstance.locationJoinedAt = null
      this.$.currentInstance.locationPlayersInitializing = false
    })
  }

  public setCurrentInstanceLoading(loading: boolean) {
    this.mobx.action(() => {
      this.$.currentInstance.locationPlayersInitializing = loading
    })
  }

  public setCurrentInstanceLocation(location: LocationInstance | null, joinedAt: Date | null) {
    this.mobx.action(() => {
      this.$.currentInstance.locationInstance = location
      this.$.currentInstance.locationJoinedAt = joinedAt
    })
  }

  public setCurrentInstanceLocationOwner(owner: LocationOwner | null) {
    this.mobx.action(() => {
      this.$.currentInstance.locationOwner = owner
    })
  }

  public setCurrentInstanceWorldDetail(detail: WorldDetail | null) {
    this.mobx.action(() => {
      this.$.currentInstance.world = detail
    })
  }

  public setCurrentInstanceJoined(joined: boolean) {
    this.mobx.action(() => {
      this.$.currentInstance.joined = joined
    })
  }

  public setCurrentInstanceRecordId(recordId: string | null) {
    this.mobx.action(() => {
      this.$.currentInstance.recordId = recordId
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
