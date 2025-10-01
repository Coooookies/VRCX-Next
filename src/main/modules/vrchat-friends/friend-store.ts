import Nanobus from 'nanobus'
import { diffObjects } from '@main/utils/object'
import {
  generateLocationTarget,
  getLocationInstanceDependency,
  toFriendInformationFromTracking,
  toLocationInstanceOverviewFromTracking
} from './factory'
import { isGroupInstance, isSameLocationInstance } from '../vrchat-worlds/utils'
import { RequestQueue } from '@shared/utils/async'
import { Platform, UserState } from '@shared/definition/vrchat-api-response'
import {
  InstanceAccessCategory,
  LocationInstanceOverview
} from '@shared/definition/vrchat-instances'
import {
  CURRENT_INSTANCE_BATCH_QUEUE_LIMIT,
  CURRENT_INSTANCE_QUEUE_LIMIT,
  FRIEND_UPDATE_COMPARE_KEYS
} from './constants'
import type { DiffResult } from '@main/utils/object'
import type { VRChatWorlds } from '../vrchat-worlds'
import type { VRChatGroups } from '../vrchat-groups'
import type { WorldEntity } from '../database/entities/vrchat-cache-world'
import type { GroupEntity } from '../database/entities/vrchat-cache-group'
import type { WorldSummary } from '@shared/definition/vrchat-worlds'
import type { BaseFriendInformation, FriendInformation } from '@shared/definition/vrchat-friends'
import type {
  FriendInformationWithLocationTracking,
  FriendInformationWithRawLocation,
  LocationInstanceWithTracking
} from './types'

export type TrackSymbolReference = Record<string, symbol>

export class FriendsStore extends Nanobus<{
  'friend:clear': () => void
  'friend:add': (friend: FriendInformation) => void
  'friend:state': (
    friendUserId: string,
    friend: FriendInformation,
    state: UserState,
    platform: Platform
  ) => void
  'friend:present': (friends: FriendInformation[]) => void
  'friend:delete': (friendUserId: string, friend: FriendInformation) => void
  'friend:location': (
    friendUserId: string,
    friend: FriendInformation,
    location: LocationInstanceOverview | null
  ) => void
  'friend:patch-location': (
    friendUserId: string,
    friend: FriendInformation,
    location: LocationInstanceOverview
  ) => void
  'friend:update': (
    friendUserId: string,
    friend: BaseFriendInformation,
    detailDiff: DiffResult<BaseFriendInformation>['diff'],
    updatedKeys: DiffResult<BaseFriendInformation>['keys']
  ) => void
}> {
  private readonly friendSessions = new Map<string, FriendInformationWithLocationTracking>()
  private readonly batchRequestQueue = new RequestQueue(CURRENT_INSTANCE_BATCH_QUEUE_LIMIT)
  private readonly requestQueue = new RequestQueue(CURRENT_INSTANCE_QUEUE_LIMIT)

  constructor(
    private readonly group: VRChatGroups,
    private readonly world: VRChatWorlds
  ) {
    super('VRChatFriends:FriendSessions')
  }

  public presentFriends(friends: FriendInformationWithRawLocation[]) {
    const trackSymbols: TrackSymbolReference = {}
    const details: FriendInformationWithLocationTracking[] = []

    for (const friend of friends) {
      const nextLocation = generateLocationTarget(
        friend.currentLocationRaw,
        friend.travelingLocationRaw
      )

      if (nextLocation) {
        trackSymbols[friend.userId] = nextLocation.__trackSymbol__
      }

      const detail: FriendInformationWithLocationTracking = {
        ...friend,
        location: nextLocation
      }

      details.push(detail)
      this.friendSessions.set(friend.userId, detail)
    }

    this.batchUpdateFriendLocation(trackSymbols)
    this.emit('friend:present', details.map(toFriendInformationFromTracking))
    return details
  }

  public addFriend(friend: FriendInformationWithRawLocation) {
    const nextLocation = generateLocationTarget(
      friend.currentLocationRaw,
      friend.travelingLocationRaw
    )

    const detail: FriendInformationWithLocationTracking = { ...friend, location: nextLocation }
    const updated = toFriendInformationFromTracking(detail)

    this.emit('friend:add', updated)

    if (nextLocation) {
      this.emit(
        'friend:location',
        friend.userId,
        updated,
        toLocationInstanceOverviewFromTracking(nextLocation)
      )

      this.batchUpdateFriendLocation({
        [friend.userId]: nextLocation.__trackSymbol__
      })
    }
  }

  public deleteFriend(userId: string) {
    const existing = this.friendSessions.get(userId)

    if (existing) {
      this.friendSessions.delete(userId)
      this.emit('friend:delete', userId, toFriendInformationFromTracking(existing))
    }
  }

  public clear() {
    this.friendSessions.clear()
    this.emit('friend:clear')
  }

  public updateFriendState(
    userId: string,
    state: UserState,
    platform: Platform,
    updatedFriend?: BaseFriendInformation
  ) {
    const existing = this.friendSessions.get(userId)
    // const updatedDetail = updatedFriend || {}

    if (!existing) {
      return
    }

    existing.state = state
    existing.platform = platform

    if (state === UserState.Offline || state === UserState.Active) {
      existing.location = null
      this.emit('friend:location', userId, existing, null)
    }

    if (updatedFriend) {
      this.updateFriendAttributes(userId, updatedFriend)
    }

    const updated = updatedFriend || {}
    const detail = toFriendInformationFromTracking({
      ...existing,
      ...updated,
      platform,
      state
    })

    this.emit('friend:state', userId, detail, state, platform)
  }

  public updateFriendAttributes(userId: string, updatedFriend: BaseFriendInformation) {
    const existing = this.friendSessions.get(userId)

    if (!existing) {
      return
    }

    const { diff: detailDiff, keys: updatedKeys } = diffObjects<BaseFriendInformation>(
      existing,
      updatedFriend,
      FRIEND_UPDATE_COMPARE_KEYS
    )

    const nextDetail: FriendInformationWithLocationTracking = {
      ...existing,
      ...updatedFriend
    }

    this.friendSessions.set(userId, nextDetail)
    this.emit(
      'friend:update',
      userId,
      toFriendInformationFromTracking(nextDetail),
      detailDiff,
      updatedKeys
    )
  }

  public updateFriendLocation(
    userId: string,
    currentLocationRaw: string,
    travelingLocationRaw: string,
    world?: WorldSummary
  ) {
    const existing = this.friendSessions.get(userId)

    if (!existing) {
      return
    }

    const nextLocation = generateLocationTarget(currentLocationRaw, travelingLocationRaw)
    const isSameLocation = isSameLocationInstance(
      existing.location?.instance || null,
      nextLocation?.instance || null
    )

    if (isSameLocation) {
      existing.location!.isTraveling = nextLocation!.isTraveling
    } else {
      existing.location = nextLocation
      if (nextLocation) {
        nextLocation.referenceWorld = world
        this.batchUpdateFriendLocation({
          [userId]: nextLocation.__trackSymbol__
        })
      }
    }

    const location = existing.location
      ? toLocationInstanceOverviewFromTracking(existing.location)
      : null

    this.emit('friend:location', userId, existing, location)
  }

  private patchFriendLocationReference(
    userId: string,
    trackSymbol: symbol,
    worlds: Map<string, WorldEntity>,
    groups: Map<string, GroupEntity>
  ) {
    const existing = this.friendSessions.get(userId)

    if (!existing || !existing.location || existing.location.__trackSymbol__ !== trackSymbol) {
      return
    }

    const location = existing.location
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

    this.emit(
      'friend:patch-location',
      userId,
      toFriendInformationFromTracking(existing),
      toLocationInstanceOverviewFromTracking(location)
    )
  }

  private async batchUpdateFriendLocation(tracker: TrackSymbolReference) {
    const friendUserIds = Object.keys(tracker)

    if (friendUserIds.length === 0) {
      return
    }

    const friendUserLocations = friendUserIds
      .map((id) => this.friendSessions.get(id)!)
      .map((friend) => friend.location)
      .filter((location): location is LocationInstanceWithTracking => location !== null)

    const resolvedWorlds = friendUserLocations
      .map((location) => location.referenceWorld)
      .filter((world): world is WorldSummary => !!world)

    const referenceIds = getLocationInstanceDependency(friendUserLocations.map((l) => l.instance))
    const pendingGroupIds = referenceIds.groupIds
    const pendingWorldIds = referenceIds.worldIds.filter(
      (id) => !resolvedWorlds.find((w) => w.worldId === id)
    )

    const batchMode = friendUserLocations.length > 0
    const worlds = batchMode
      ? await this.batchRequestQueue.add(() => this.world.fetchWorldSummaries(pendingWorldIds))
      : await this.requestQueue.add(() => this.world.fetchWorldSummaries(pendingWorldIds))

    const groups = batchMode
      ? await this.batchRequestQueue.add(() => this.group.fetchGroupSummaries(pendingGroupIds))
      : await this.requestQueue.add(() => this.group.fetchGroupSummaries(pendingGroupIds))

    for (const [userId, trackSymbol] of Object.entries(tracker)) {
      this.patchFriendLocationReference(userId, trackSymbol, worlds, groups)
    }
  }

  public get friends(): FriendInformation[] {
    return [...this.friendSessions.values()].map(toFriendInformationFromTracking)
  }
}
