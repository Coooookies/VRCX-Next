import Nanobus from 'nanobus'
import { diffObjects } from '@main/utils/object'
import { compareFriendStates, compareMissingFriends, transformWhereaboutsOfFriends } from './utils'
import { getLocationInstanceDependency, toLocation } from './factory'
import { isGroupInstance, isSameLocationInstance, isUserInstance } from '../vrchat-instances/utils'
import {
  CURRENT_INSTANCE_BATCH_QUEUE_LIMIT,
  CURRENT_INSTANCE_QUEUE_LIMIT,
  FRIEND_UPDATE_COMPARE_KEYS
} from './constants'
import { InstanceAccessCategory } from '@shared/definition/vrchat-instances'
import { UserState } from '@shared/definition/vrchat-api-response-community'
import { Platform } from '@shared/definition/vrchat-api-response-replenish'
import { RequestQueue } from '@shared/utils/async'
import { FriendAttributeActivities } from '@shared/definition/vrchat-friends'
import type { VRChatGroups } from '../vrchat-groups'
import type { VRChatWorlds } from '../vrchat-worlds'
import type { VRChatUsers } from '../vrchat-users'
import type { VRChatAvatars } from '../vrchat-avatars'
import type { WorldSummary } from '@shared/definition/vrchat-worlds'
import type { WorldEntity } from '../database/entities/vrchat-cache-world'
import type { UserEntity } from '../database/entities/vrchat-cache-users'
import type { GroupEntity } from '../database/entities/vrchat-cache-group'
import type { DiffResult } from '@main/utils/object'
import type { UserAvatar } from '@shared/definition/vrchat-avatars'
import type { LocationInstanceOverview } from '@shared/definition/vrchat-instances'
import type { BaseFriendInformation, FriendInformation } from '@shared/definition/vrchat-friends'
import type { FriendInformationWithRawLocation } from './types'
import type { CurrentUserFriendIds, UserProcessHandler } from '../vrchat-users/types'

export class FriendsSessions extends Nanobus<{
  'sync:present-friends': (friends: Readonly<FriendInformation>[]) => void
  'sync:append-friend': (friend: Readonly<FriendInformation>) => void
  'sync:update-friend': (userId: string, data: Readonly<FriendInformation>) => void
  'sync:update-friends': (data: Readonly<FriendInformation>[]) => void
  'sync:remove-friend': (userId: string) => void
  'sync:clear-friends': () => void
  'event:friend-online': (
    userId: string,
    data: Readonly<FriendInformation>,
    beforeState: UserState
  ) => void
  'event:friend-web-active': (
    userId: string,
    data: Readonly<FriendInformation>,
    beforeState: UserState
  ) => void
  'event:friend-offline': (
    userId: string,
    data: Readonly<FriendInformation>,
    beforeState: UserState
  ) => void
  'event:friend-add': (data: Readonly<FriendInformation>) => void
  'event:friend-delete': (userId: string, data: Readonly<FriendInformation>) => void
  'event:friend-avatar': (
    userId: string,
    data: Readonly<FriendInformation>,
    avatar: UserAvatar,
    detailPendingPromise?: Promise<UserAvatar | null>
  ) => void
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
  private readonly _avatarTrackSymbols = new Map<string, symbol>()

  // query pool
  private readonly _batchRequestQueue = new RequestQueue(CURRENT_INSTANCE_BATCH_QUEUE_LIMIT)
  private readonly _requestQueue = new RequestQueue(CURRENT_INSTANCE_QUEUE_LIMIT)

  // state
  private _initialSyncCompleted = false
  private _compensatorySyncInProgress = false

  constructor(
    private readonly group: VRChatGroups,
    private readonly world: VRChatWorlds,
    private readonly users: VRChatUsers,
    private readonly avatars: VRChatAvatars
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

  public syncInitialFriendsComplete(ids: CurrentUserFriendIds) {
    this._initialSyncCompleted = true
    this.handleSyncFriendIds(ids)
  }

  public clearFriends() {
    this._locationTrackSymbols.clear()
    this._stateTrackSymbols.clear()
    this.friendSessions.clear()
    this._initialSyncCompleted = false
    this._compensatorySyncInProgress = false
    this.emit('sync:clear-friends')
  }

  private manualCompleteFriends(userIds: string[]) {
    const fetchUserProcessHandler: UserProcessHandler = async (user) => {
      const userId = user.userId
      const currentLocationRaw = user.locationRawContext || ''
      const travelingLocationRaw = ''
      const location = toLocation(currentLocationRaw, travelingLocationRaw)
      const detail: FriendInformation = {
        ...user,
        order: 0,
        location
      }

      this.friendSessions.set(userId, detail)
      this.emit('sync:append-friend', detail)

      if (!location) {
        return
      }

      const updatedLocationFriend = await this.batchUpdateFriendLocation(userId)
      if (!updatedLocationFriend) {
        return
      }

      this.emit('sync:update-friend', userId, updatedLocationFriend)
    }

    return this._batchRequestQueue.add(() =>
      this.users.fetchUsers(userIds, fetchUserProcessHandler)
    )
  }

  private async manualSyncFriendAsOnline(userId: string) {
    const currentUser = this.friendSessions.get(userId)
    const fetchedUser = await this._requestQueue.add(() => this.users.fetchUser(userId))

    if (!currentUser || !fetchedUser || currentUser.state === UserState.Online) {
      return
    }

    const user = { ...fetchedUser, order: 0 }
    const platform = currentUser.platform
    const currentLocationRaw = fetchedUser.locationRawContext || ''
    const travelingLocationRaw = ''

    await this.handleUpdateFriendOnline(
      userId,
      user,
      platform,
      currentLocationRaw,
      travelingLocationRaw
    )
  }

  private manualSyncFriendAsOffline(userId: string) {
    const currentUser = this.friendSessions.get(userId)

    if (!currentUser || currentUser.state === UserState.Offline) {
      return
    }

    const platform = Platform.Unknown
    return this.handleUpdateFriendOffline(userId, platform)
  }

  private async manualSyncFriendAsWebActive(userId: string) {
    const currentUser = this.friendSessions.get(userId)
    const fetchedUser = await this._requestQueue.add(() => this.users.fetchUser(userId))

    if (!currentUser || !fetchedUser || currentUser.state === UserState.Active) {
      return
    }

    const user = { ...fetchedUser, order: 0 }
    const platform = Platform.Web
    await this.handleUpdateFriendLocation(userId, '', '')
    await this.handleUpdateFriendWebActive(userId, user, platform)
  }

  public async handleSyncFriendIds(ids: CurrentUserFriendIds) {
    if (this._compensatorySyncInProgress || !this._initialSyncCompleted) {
      return
    }

    this._compensatorySyncInProgress = true

    // fetch missing friends
    const sessions = this.friendSessions
    const missingFriendIds = compareMissingFriends(ids.total, sessions)

    if (missingFriendIds.size > 0) {
      await this.manualCompleteFriends([...missingFriendIds])
    }

    const onlineComparedResult = compareFriendStates(ids.online, sessions, UserState.Online)
    const offlineComparedResult = compareFriendStates(ids.offline, sessions, UserState.Offline)
    const activeComparedResult = compareFriendStates(ids.active, sessions, UserState.Active)
    const transformedWhereabouts = transformWhereaboutsOfFriends({
      online: onlineComparedResult,
      offline: offlineComparedResult,
      active: activeComparedResult
    })

    for (const userId of transformedWhereabouts.online) {
      this.manualSyncFriendAsOnline(userId)
    }

    for (const userId of transformedWhereabouts.offline) {
      this.manualSyncFriendAsOffline(userId)
    }

    for (const userId of transformedWhereabouts.active) {
      this.manualSyncFriendAsWebActive(userId)
    }

    this._compensatorySyncInProgress = false
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

    if (!updatedStateFriend.location) {
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

    const prevState = friend.state
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
    this.emit('event:friend-online', userId, newDetail, prevState)

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

    if (!friend || friend.state === UserState.Active) {
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { state: _, platform: __, ...rest } = updatedData

    const prevState = friend.state
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
    this.emit('event:friend-web-active', userId, newDetail, prevState)
  }

  public async handleUpdateFriendOffline(userId: string, platform: Platform) {
    const friend = this.friendSessions.get(userId)

    if (!friend || friend.state === UserState.Offline) {
      return
    }

    const prevState = friend.state
    const newDetail: FriendInformation = {
      ...friend,
      state: UserState.Offline,
      platform,
      location: null
    }

    this.friendSessions.set(userId, newDetail)
    this.createStateSymbolSnapshot([userId])

    this.emit('sync:update-friend', userId, newDetail)
    this.emit('event:friend-offline', userId, newDetail, prevState)
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

  public async handleUpdateFriendAttributes(userId: string, updatedData: BaseFriendInformation) {
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

    if (updatedKeys.includes(FriendAttributeActivities.avatar)) {
      const detailPendingPromise = this.batchUpdateFriendAvatar(userId)

      this.emit(
        'event:friend-avatar',
        userId,
        newDetail,
        detailDiff.after.avatar!,
        detailPendingPromise.then((updated) => updated?.avatar || null)
      )

      const updatedAvatarFriend = await detailPendingPromise
      if (!updatedAvatarFriend) {
        return
      }

      this.emit('sync:update-friend', userId, newDetail)
    }
  }

  private async batchUpdateFriendState(userId: string): Promise<FriendInformation | null> {
    const snapshot = this.createStateSymbolSnapshot([userId])
    const currentUser = this.friendSessions.get(userId)
    const fetchedUser = await this._requestQueue.add(() => this.users.fetchUser(userId))

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

  private async batchUpdateFriendAvatar(userId: string): Promise<FriendInformation | null> {
    const snapshot = this.createAvatarSymbolSnapshot([userId])
    const currentUser = this.friendSessions.get(userId)

    if (!currentUser) {
      return null
    }

    const avatarImageId = currentUser.avatar.imageFileId
    const fetchedReferenceAvatar = await this._requestQueue.add(() =>
      this.avatars.fetchReferenceAvatar(avatarImageId)
    )

    if (!fetchedReferenceAvatar || !snapshot.isSameSymbol(userId)) {
      return null
    }

    currentUser.avatar.referenceAvatarFile = fetchedReferenceAvatar
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

    const batchMode = friendLocations.length > 1
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

  private createAvatarSymbolSnapshot = (userIds: string[]) => {
    const snapshot = new Map<string, symbol>()
    for (const id of userIds) {
      const s = Symbol(id)
      snapshot.set(id, s)
      this._avatarTrackSymbols.set(id, s)
    }
    return {
      isSameSymbol: (id: string) => this._avatarTrackSymbols.get(id) === snapshot.get(id)
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

  public getFriend(userId: string): Readonly<FriendInformation> | null {
    return this.friendSessions.get(userId) || null
  }
}
