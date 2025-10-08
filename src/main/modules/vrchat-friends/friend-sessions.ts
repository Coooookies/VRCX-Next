import Nanobus from 'nanobus'
import { diffObjects } from '@main/utils/object'
import { getLocationInstanceDependency, toLocation } from './factory'
import { isGroupInstance, isSameLocationInstance, isUserInstance } from '../vrchat-instances/utils'
import {
  CURRENT_INSTANCE_BATCH_QUEUE_LIMIT,
  CURRENT_INSTANCE_QUEUE_LIMIT,
  FRIEND_UPDATE_COMPARE_KEYS
} from './constants'
import { InstanceAccessCategory } from '@shared/definition/vrchat-instances'
import { UserState } from '@shared/definition/vrchat-api-response-community'
import { RequestQueue } from '@shared/utils/async'
import type { VRChatGroups } from '../vrchat-groups'
import type { VRChatWorlds } from '../vrchat-worlds'
import type { VRChatUsers } from '../vrchat-users'
import type { WorldSummary } from '@shared/definition/vrchat-worlds'
import type { WorldEntity } from '../database/entities/vrchat-cache-world'
import type { UserEntity } from '../database/entities/vrchat-cache-users'
import type { GroupEntity } from '../database/entities/vrchat-cache-group'
import type { DiffResult } from '@main/utils/object'
import type { LocationInstanceOverview } from '@shared/definition/vrchat-instances'
import type { BaseFriendInformation, FriendInformation } from '@shared/definition/vrchat-friends'
import type { FriendInformationWithRawLocation } from './types'
import type { Platform } from '@shared/definition/vrchat-api-response-replenish'

export class FriendsSessions extends Nanobus<{
  'sync:present-friends': (friends: Readonly<FriendInformation>[]) => void
  'sync:append-friend': (friend: Readonly<FriendInformation>) => void
  'sync:update-friend': (userId: string, data: Readonly<FriendInformation>) => void
  'sync:update-friends': (data: Readonly<FriendInformation>[]) => void
  'sync:remove-friend': (userId: string) => void
  'sync:clear-friends': () => void
  'event:friend-online': (userId: string, data: Readonly<FriendInformation>) => void
  'event:friend-web-active': (userId: string, data: Readonly<FriendInformation>) => void
  'event:friend-offline': (userId: string, data: Readonly<FriendInformation>) => void
  'event:friend-add': (data: Readonly<FriendInformation>) => void
  'event:friend-delete': (userId: string, data: Readonly<FriendInformation>) => void
  'event:friend-location': (
    userId: string,
    data: Readonly<FriendInformation>,
    location: Readonly<LocationInstanceOverview> | null,
    detailPendingPromise?: Readonly<Promise<LocationInstanceOverview | null>>
  ) => void
  'event:friend-update': (
    userId: string,
    data: Readonly<FriendInformation>,
    detailDiff: Readonly<DiffResult<BaseFriendInformation>['diff']>,
    updatedKeys: Readonly<DiffResult<BaseFriendInformation>['keys']>
  ) => void
}> {
  private readonly friendSessions = new Map<string, FriendInformation>()

  // tracking symbols
  private readonly _locationTrackSymbols = new Map<string, symbol>()
  private readonly _stateTrackSymbols = new Map<string, symbol>()

  // query pool
  private readonly _batchRequestQueue = new RequestQueue(CURRENT_INSTANCE_BATCH_QUEUE_LIMIT)
  private readonly _requestQueue = new RequestQueue(CURRENT_INSTANCE_QUEUE_LIMIT)

  constructor(
    private readonly group: VRChatGroups,
    private readonly world: VRChatWorlds,
    private readonly users: VRChatUsers
  ) {
    super('VRChatFriends:FriendSessions')
  }

  public async syncInitialFriends(friends: FriendInformationWithRawLocation[]) {
    const pendingUpdateUserIds = new Set<string>()
    const details: FriendInformation[] = []

    if (friends.length === 0) {
      this.emit('sync:present-friends', [])
      return
    }

    for (const friend of friends) {
      const { currentLocationRaw, travelingLocationRaw, ...rest } = friend
      const location = toLocation(currentLocationRaw, travelingLocationRaw)
      const detail: FriendInformation = {
        ...rest,
        location
      }

      details.push(detail)
      this.friendSessions.set(friend.userId, detail)

      if (location) {
        pendingUpdateUserIds.add(friend.userId)
      }
    }

    this.emit('sync:present-friends', details)

    const updatedFriends = await this.batchUpdateFriendLocation([...pendingUpdateUserIds])
    const result = [...updatedFriends.values()].filter((f): f is FriendInformation => !!f)

    if (result.length > 0) {
      this.emit('sync:update-friends', result)
    }
  }

  public clearFriends() {
    this._locationTrackSymbols.clear()
    this._stateTrackSymbols.clear()
    this.friendSessions.clear()
    this.emit('sync:clear-friends')
  }

  public async handleAppendFriend(friend: BaseFriendInformation) {
    const userId = friend.userId
    const detail: FriendInformation = {
      ...friend,
      location: null
    }

    this.friendSessions.set(userId, detail)
    this.emit('sync:append-friend', detail)
    this.emit('event:friend-add', detail)

    const updatedStateFriend = await this.batchUpdateFriendState(userId)
    if (!updatedStateFriend) {
      return
    }

    this.emit('sync:update-friend', userId, updatedStateFriend)

    if (updatedStateFriend.location) {
      return
    }

    const updatedLocationFriend = await this.batchUpdateFriendLocation(userId)
    if (!updatedLocationFriend) {
      return
    }

    this.emit('sync:update-friend', userId, updatedLocationFriend)
  }

  public handleRemoveFriend(userId: string) {
    const friend = this.friendSessions.get(userId)
    if (!friend) {
      return
    }

    this._locationTrackSymbols.delete(userId)
    this._stateTrackSymbols.delete(userId)
    this.friendSessions.delete(userId)
    this.emit('sync:remove-friend', userId)
    this.emit('event:friend-delete', userId, friend)
  }

  public async handleUpdateFriendOnline(
    userId: string,
    updatedData: BaseFriendInformation,
    platform: Platform,
    currentLocationRaw: string,
    travelingLocationRaw: string,
    world?: WorldEntity
  ) {
    const friend = this.friendSessions.get(userId)
    if (!friend) {
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { state: _, platform: __, ...rest } = updatedData
    const location = toLocation(currentLocationRaw, travelingLocationRaw)
    const newDetail: FriendInformation = {
      ...friend,
      ...rest,
      state: UserState.Online,
      platform,
      location
    }

    if (location) {
      location.referenceWorld = world
    }

    this.friendSessions.set(userId, newDetail)
    this.createStateSymbolSnapshot([userId])

    this.emit('sync:update-friend', userId, newDetail)
    this.emit('event:friend-online', userId, newDetail)

    if (!location) {
      this.emit('event:friend-location', userId, newDetail, location)
      return
    }

    const detailPendingPromise = this.batchUpdateFriendLocation(userId)

    this.emit(
      'event:friend-location',
      userId,
      newDetail,
      location,
      detailPendingPromise.then((updated) => updated?.location || null)
    )

    const updatedLocationFriend = await detailPendingPromise
    if (!updatedLocationFriend) {
      return
    }

    this.emit('sync:update-friend', userId, updatedLocationFriend)
  }

  public async handleUpdateFriendWebActive(
    userId: string,
    updatedData: BaseFriendInformation,
    platform: Platform
  ) {
    const friend = this.friendSessions.get(userId)
    if (!friend) {
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { state: _, platform: __, ...rest } = updatedData
    const newDetail: FriendInformation = {
      ...friend,
      ...rest,
      state: UserState.Active,
      platform,
      location: null
    }

    this.friendSessions.set(userId, newDetail)
    this.createStateSymbolSnapshot([userId])

    this.emit('sync:update-friend', userId, newDetail)
    this.emit('event:friend-web-active', userId, newDetail)
  }

  public async handleUpdateFriendOffline(userId: string, platform: Platform) {
    const friend = this.friendSessions.get(userId)
    if (!friend) {
      return
    }

    const newDetail: FriendInformation = {
      ...friend,
      state: UserState.Offline,
      platform,
      location: null
    }

    this.friendSessions.set(userId, newDetail)
    this.createStateSymbolSnapshot([userId])

    this.emit('sync:update-friend', userId, newDetail)
    this.emit('event:friend-offline', userId, newDetail)
  }

  public async handleUpdateFriendLocation(
    userId: string,
    currentLocationRaw: string,
    travelingLocationRaw: string,
    world?: WorldEntity
  ) {
    const location = toLocation(currentLocationRaw, travelingLocationRaw)
    const friend = this.friendSessions.get(userId)
    if (!friend) {
      return
    }

    if (isSameLocationInstance(friend.location?.instance || null, location?.instance || null)) {
      if (friend.location && location) {
        friend.location.isTraveling = location.isTraveling
        this.emit('sync:update-friend', userId, friend)
      }
      return
    }

    if (location) {
      location.referenceWorld = world
    }

    const newDetail: FriendInformation = {
      ...friend,
      location
    }

    this.friendSessions.set(userId, newDetail)
    this.emit('sync:update-friend', userId, newDetail)

    if (!location) {
      this.emit('event:friend-location', userId, newDetail, location)
      return
    }

    const detailPendingPromise = this.batchUpdateFriendLocation(userId)

    this.emit(
      'event:friend-location',
      userId,
      newDetail,
      location,
      detailPendingPromise.then((updated) => updated?.location || null)
    )

    const updatedLocationFriend = await detailPendingPromise
    if (!updatedLocationFriend) {
      return
    }

    this.emit('sync:update-friend', userId, updatedLocationFriend)
  }

  public handleUpdateFriendAttributes(userId: string, updatedData: BaseFriendInformation) {
    const friend = this.friendSessions.get(userId)
    if (!friend) {
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { state: _, platform: __, ...rest } = updatedData
    const { diff: detailDiff, keys: updatedKeys } = diffObjects<BaseFriendInformation>(
      friend,
      updatedData,
      FRIEND_UPDATE_COMPARE_KEYS
    )

    const newDetail: FriendInformation = {
      ...friend,
      ...rest
    }

    this.friendSessions.set(userId, newDetail)
    this.emit('sync:update-friend', userId, newDetail)
    this.emit('event:friend-update', userId, newDetail, detailDiff, updatedKeys)
  }

  private async batchUpdateFriendState(userId: string): Promise<FriendInformation | null> {
    const snapshot = this.createStateSymbolSnapshot([userId])
    const currentUser = this.friendSessions.get(userId)
    const fetchedUser = await this.users.fetchUser(userId)

    if (!currentUser || !fetchedUser) {
      return null
    }

    const state = fetchedUser.state
    const platform = fetchedUser.platform
    const location = toLocation(fetchedUser.locationRawContext || '', '')

    if (!snapshot.isSameSymbol(userId)) {
      return null
    }

    currentUser.state = state
    currentUser.platform = platform
    currentUser.location = location
    return currentUser
  }

  private async batchUpdateFriendLocation(userId: string): Promise<FriendInformation | null>
  private async batchUpdateFriendLocation(
    userId: string[]
  ): Promise<Map<string, FriendInformation | null>>
  private async batchUpdateFriendLocation(
    userId: string | string[]
  ): Promise<FriendInformation | Map<string, FriendInformation | null> | null> {
    const userIds = Array.isArray(userId) ? userId : [userId]
    const snapshot = this.createLocationSymbolSnapshot(userIds)

    const friendLocations = userIds
      .map((id) => this.friendSessions.get(id)!)
      .map((friend) => friend.location)
      .filter((location): location is LocationInstanceOverview => location !== null)

    const resolvedWorlds = friendLocations
      .map((location) => location.referenceWorld)
      .filter((world): world is WorldSummary => !!world)

    const referenceIds = getLocationInstanceDependency(friendLocations.map((l) => l.instance))
    const pendingGroupIds = referenceIds.groupIds
    const pendingUserIds = referenceIds.userIds
    const pendingWorldIds = referenceIds.worldIds.filter(
      (id) => !resolvedWorlds.find((w) => w.worldId === id)
    )

    const batchMode = friendLocations.length > 0
    const worldQueue = batchMode
      ? this._batchRequestQueue.add(() => this.world.fetchWorldSummaries(pendingWorldIds))
      : this._requestQueue.add(() => this.world.fetchWorldSummaries(pendingWorldIds))

    const groupQueue = batchMode
      ? this._batchRequestQueue.add(() => this.group.fetchGroupSummaries(pendingGroupIds))
      : this._requestQueue.add(() => this.group.fetchGroupSummaries(pendingGroupIds))

    const userQueue = batchMode
      ? this._batchRequestQueue.add(() => this.users.fetchUserSummaries(pendingUserIds))
      : this._requestQueue.add(() => this.users.fetchUserSummaries(pendingUserIds))

    const [worlds, groups, users] = await Promise.all([worldQueue, groupQueue, userQueue])

    if (Array.isArray(userId)) {
      const results = new Map<string, FriendInformation | null>()

      for (const userId of userIds) {
        if (!snapshot.isSameSymbol(userId)) {
          continue
        }

        results.set(userId, this.assembleFriendLocationReference(userId, worlds, groups, users))
      }

      return results
    } else {
      if (!snapshot.isSameSymbol(userId)) {
        return null
      }

      return this.assembleFriendLocationReference(userId, worlds, groups, users)
    }
  }

  private assembleFriendLocationReference(
    userId: string,
    worlds: Map<string, WorldEntity>,
    groups: Map<string, GroupEntity>,
    users: Map<string, UserEntity>
  ): FriendInformation | null {
    const existing = this.friendSessions.get(userId)

    if (!existing || !existing.location) {
      return null
    }

    const location = {
      ...existing.location
    }

    const world = worlds.get(location.instance.worldId)
    const user = isUserInstance(location.instance) ? users.get(location.instance.userId) : undefined
    const group = isGroupInstance(location.instance)
      ? groups.get(location.instance.groupId)
      : undefined

    if (world) {
      location.referenceWorld = world
    }

    if (group && location.category === InstanceAccessCategory.Group) {
      location.referenceGroup = group
    }

    if (location.category === InstanceAccessCategory.Friend) {
      location.referenceUser = user
    }

    existing.location = location
    return existing
  }

  private createLocationSymbolSnapshot = (userIds: string[]) => {
    const snapshot = new Map<string, symbol>()
    for (const id of userIds) {
      const s = Symbol(id)
      snapshot.set(id, s)
      this._locationTrackSymbols.set(id, s)
    }
    return {
      isSameSymbol: (id: string) => this._locationTrackSymbols.get(id) === snapshot.get(id)
    }
  }

  private createStateSymbolSnapshot = (userIds: string[]) => {
    const snapshot = new Map<string, symbol>()
    for (const id of userIds) {
      const s = Symbol(id)
      snapshot.set(id, s)
      this._stateTrackSymbols.set(id, s)
    }
    return {
      isSameSymbol: (id: string) => this._stateTrackSymbols.get(id) === snapshot.get(id)
    }
  }

  public get friends(): Readonly<FriendInformation>[] {
    return [...this.friendSessions.values()]
  }
}
