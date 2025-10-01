import Nanobus from 'nanobus'
import { toJS } from 'mobx'
import { diffObjects } from '@main/utils/object'
import {
  generateLocationTarget,
  getLocationInstanceDependency,
  toLocationInstanceOverviewFromTracking
} from '../vrchat-friends/factory'
import { isGroupInstance, isSameLocationInstance } from '../vrchat-worlds/utils'
import { USER_UPDATE_COMPARE_KEYS } from './constants'
import { InstanceAccessCategory } from '@shared/definition/vrchat-instances'
import type { MobxState } from '../mobx-state'
import type { VRChatGroups } from '../vrchat-groups'
import type { VRChatWorlds } from '../vrchat-worlds'
import type { UserStoreSharedState } from '@shared/definition/mobx-shared'
import type { CurrentUserInformation } from '@shared/definition/vrchat-users'
import type { LocationInstanceOverview } from '@shared/definition/vrchat-instances'
import type { DiffResult } from '@main/utils/object'

const MODULE_NAME = 'VRChatUsers:CurrentUserStore'

export class CurrentUserStore extends Nanobus<{
  'user:location': (location: LocationInstanceOverview | null) => void
  'user:patch-location': (location: LocationInstanceOverview | null) => void
  'user:update': (
    user: CurrentUserInformation,
    detailDiff: DiffResult<CurrentUserInformation>['diff'],
    updatedKeys: DiffResult<CurrentUserInformation>['keys']
  ) => void
}> {
  private $!: UserStoreSharedState
  private __trackSymbol__: symbol = Symbol('track')

  constructor(
    private readonly mobx: MobxState,
    private readonly group: VRChatGroups,
    private readonly world: VRChatWorlds
  ) {
    super(MODULE_NAME)
    this.$ = this.mobx.observable(
      MODULE_NAME,
      {
        user: null,
        location: null
      },
      ['user', 'location']
    )
  }

  public presentUser(
    user: CurrentUserInformation,
    currentLocationRaw: string,
    travelingLocationRaw: string
  ) {
    const nextLocation = generateLocationTarget(currentLocationRaw, travelingLocationRaw)

    this.mobx.action(() => {
      this.$.user = user
    })

    if (nextLocation) {
      this.__trackSymbol__ = nextLocation.__trackSymbol__
      this.batchUpdateLocation(nextLocation.__trackSymbol__)
    }
  }

  public updateUser(user: CurrentUserInformation) {
    const prevUser = toJS(this.$.user)

    if (!prevUser) {
      return
    }

    const { diff: detailDiff, keys: updatedKeys } = diffObjects<CurrentUserInformation>(
      prevUser,
      user,
      USER_UPDATE_COMPARE_KEYS
    )

    this.mobx.action(() => {
      this.$.user = user
    })

    this.emit('user:update', user, detailDiff, updatedKeys)
  }

  public updateLocation(currentLocationRaw: string, travelingLocationRaw: string) {
    const prevLocation = toJS(this.$.location)
    const nextLocation = generateLocationTarget(currentLocationRaw, travelingLocationRaw)
    const isSameLocation = isSameLocationInstance(
      prevLocation?.instance || null,
      nextLocation?.instance || null
    )

    if (isSameLocation) {
      this.mobx.action(() => {
        this.$.location = {
          ...prevLocation!,
          isTraveling: nextLocation!.isTraveling
        }
      })
    } else {
      this.mobx.action(() => {
        this.$.location = nextLocation ? toLocationInstanceOverviewFromTracking(nextLocation) : null
      })

      if (nextLocation) {
        this.__trackSymbol__ = nextLocation.__trackSymbol__
        this.batchUpdateLocation(nextLocation.__trackSymbol__)
      }
    }

    this.emit('user:location', toJS(this.$.location))
  }

  private async batchUpdateLocation(trackSymbol: symbol) {
    const location = toJS(this.$.location)

    if (this.__trackSymbol__ !== trackSymbol || !location) {
      return
    }

    const referenceIds = getLocationInstanceDependency(location.instance)
    const pendingGroupIds = referenceIds.groupIds
    const pendingWorldIds = referenceIds.worldIds

    const worlds = await this.world.fetchWorldSummaries(pendingWorldIds)
    const groups = await this.group.fetchGroupSummaries(pendingGroupIds)

    const world = worlds.get(location.instance.worldId)
    const group = isGroupInstance(location.instance)
      ? groups.get(location.instance.groupId)
      : undefined

    if (world) {
      location.referenceWorld = world
    }

    if (group && location.category === InstanceAccessCategory.Group) {
      location.referenceGroup = group
    }

    this.mobx.action(() => {
      this.$.location = location
    })

    this.emit('user:patch-location', location)
  }

  public clear() {
    this.mobx.action(() => {
      this.$.user = null
      this.$.location = null
    })
  }

  public get state() {
    return this.$
  }

  public get activeUser() {
    return toJS(this.$.user)
  }
}
