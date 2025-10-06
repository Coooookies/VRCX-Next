import Nanobus from 'nanobus'
import { toJS } from 'mobx'
import { diffObjects } from '@main/utils/object'
import { getLocationInstanceDependency, toLocation } from '../vrchat-friends/factory'
import { isGroupInstance, isSameLocationInstance } from '../vrchat-instances/utils'
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
  'user:location': (location: Readonly<LocationInstanceOverview> | null) => void
  'user:update': (
    user: Readonly<CurrentUserInformation>,
    detailDiff: Readonly<DiffResult<CurrentUserInformation>['diff']>,
    updatedKeys: Readonly<DiffResult<CurrentUserInformation>['keys']>
  ) => void
}> {
  private $!: UserStoreSharedState
  private __locationTrackSymbol__: symbol = Symbol('track')

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

  public syncInitialUser(
    user: CurrentUserInformation,
    currentLocationRaw: string,
    travelingLocationRaw: string
  ) {
    const nextLocation = toLocation(currentLocationRaw, travelingLocationRaw)

    this.mobx.action(() => {
      this.$.user = user
      this.$.location = nextLocation
    })

    this.emit('user:location', nextLocation)

    if (nextLocation) {
      this.batchUpdateLocation().then((location) => {
        if (location) {
          this.emit('user:location', location)
        }
      })
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
    const nextLocation = toLocation(currentLocationRaw, travelingLocationRaw)
    const isSameLocation = isSameLocationInstance(
      prevLocation?.instance || null,
      nextLocation?.instance || null
    )

    if (isSameLocation) {
      if (prevLocation && nextLocation) {
        prevLocation.isTraveling = nextLocation.isTraveling

        this.mobx.action(() => prevLocation)
        this.emit('user:location', prevLocation)
      }
    } else {
      this.mobx.action(() => (this.$.location = nextLocation))
      this.emit('user:location', nextLocation)

      if (nextLocation) {
        this.batchUpdateLocation().then((location) => {
          if (location) {
            this.emit('user:location', location)
          }
        })
      }
    }
  }

  private async batchUpdateLocation() {
    const location = toJS(this.$.location)

    if (!location) {
      return
    }

    const trackSymbol = Symbol('batch')
    const isSameSymbol = () => this.__locationTrackSymbol__ === trackSymbol
    this.__locationTrackSymbol__ = trackSymbol

    const referenceIds = getLocationInstanceDependency(location.instance)
    const pendingGroupIds = referenceIds.groupIds
    const pendingWorldIds = referenceIds.worldIds

    const worlds = await this.world.fetchWorldSummaries(pendingWorldIds)
    const groups = await this.group.fetchGroupSummaries(pendingGroupIds)

    const world = worlds.get(location.instance.worldId)
    const group = isGroupInstance(location.instance)
      ? groups.get(location.instance.groupId)
      : undefined

    if (!isSameSymbol()) {
      return
    }

    if (world) {
      location.referenceWorld = world
    }

    if (group && location.category === InstanceAccessCategory.Group) {
      location.referenceGroup = group
    }

    this.mobx.action(() => {
      this.$.location = location
    })

    return location
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
