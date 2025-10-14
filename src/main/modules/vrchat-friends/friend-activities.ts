import {
  toFriendAvatarActivity,
  toFriendAttributeActivities,
  toFriendStateActivity,
  toFriendLocationActivity,
  toFriendAvatarActivityEntity,
  toFriendAttributeActivityEntity,
  toFriendLocationActivityEntity,
  toFriendCommonActivityEntity,
  toFriendCommonActivity
} from './factory'
import { generateFriendActivityId } from './utils'
import { FriendActivityEvents } from '@shared/definition/vrchat-friends'
import { UserState } from '@shared/definition/vrchat-api-response'
import type { DiffResult } from '@main/utils/object'
import type { VRChatUsers } from '../vrchat-users'
import type { UserAvatar } from '@shared/definition/vrchat-avatars'
import type { LocationInstanceOverview } from '@shared/definition/vrchat-instances'
import type {
  FriendInformation,
  FriendActivity,
  BaseFriendInformation
} from '@shared/definition/vrchat-friends'
import type { FriendsRepository } from './repository'
import type {
  FriendAvatarActivityEntity,
  FriendAttributeActivityEntity,
  FriendLocationActivityEntity,
  FriendCommonActivityEntity
} from '../database/entities/vrchat-friend-activity'

export class FriendsActivities {
  private readonly activities = new Map<string, FriendActivity>()

  constructor(
    private readonly users: VRChatUsers,
    private readonly repository: FriendsRepository
  ) {}

  private async handleActivities(activity: FriendActivity | FriendActivity[]) {
    const activities = Array.isArray(activity) ? activity : [activity]
    const pendingSaveAttributeActivities: FriendAttributeActivityEntity[] = []
    const pendingSaveAvatarActivities: FriendAvatarActivityEntity[] = []
    const pendingSaveLocationActivities: FriendLocationActivityEntity[] = []
    const pendingSaveCommonActivities: FriendCommonActivityEntity[] = []

    if (activities.length === 0 || !this.users.activeUser) {
      return Promise.resolve()
    }

    for (const activity of activities) {
      this.activities.set(activity.activityId, activity)

      switch (activity.activityType) {
        case FriendActivityEvents.LocationChange: {
          const entity = toFriendLocationActivityEntity(activity, this.users.activeUser.userId)
          pendingSaveLocationActivities.push(entity)
          break
        }
        case FriendActivityEvents.AvatarChange: {
          const entity = toFriendAvatarActivityEntity(activity, this.users.activeUser.userId)
          pendingSaveAvatarActivities.push(entity)
          break
        }
        case FriendActivityEvents.BioChange:
        case FriendActivityEvents.DisplayNameChange:
        case FriendActivityEvents.StateChange:
        case FriendActivityEvents.StatusChange:
        case FriendActivityEvents.StatusDescriptionChange:
        case FriendActivityEvents.SupporterChange:
        case FriendActivityEvents.TrustRankChange: {
          const entity = toFriendAttributeActivityEntity(activity, this.users.activeUser.userId)
          pendingSaveAttributeActivities.push(entity)
          break
        }
        case FriendActivityEvents.NewFriend:
        case FriendActivityEvents.RemovedFriend: {
          const entity = toFriendCommonActivityEntity(activity, this.users.activeUser.userId)
          pendingSaveCommonActivities.push(entity)
          break
        }
      }
    }

    return await Promise.all([
      this.repository.saveAttributeActivityEntities(pendingSaveAttributeActivities),
      this.repository.saveAvatarActivityEntities(pendingSaveAvatarActivities),
      this.repository.saveLocationActivityEntities(pendingSaveLocationActivities),
      this.repository.saveCommonActivityEntities(pendingSaveCommonActivities)
    ]).then(() => {})
  }

  public async handleStateChangeActivities(
    userId: string,
    user: Readonly<FriendInformation>,
    beforeState: UserState,
    afterState: UserState
  ) {
    const activity = toFriendStateActivity(userId, user, beforeState, afterState)
    return this.handleActivities(activity)
  }

  public async handleAvatarChangeActivity(
    userId: string,
    user: Readonly<FriendInformation>,
    avatar: UserAvatar,
    detailPendingPromise?: Promise<UserAvatar | null>
  ) {
    const activityId = generateFriendActivityId()
    const activity = toFriendAvatarActivity(activityId, userId, user, avatar)
    const upsertPromise = this.handleActivities(activity)

    if (detailPendingPromise) {
      return Promise.all([upsertPromise, detailPendingPromise])
        .then(([, a]) => (a ? toFriendAvatarActivity(activityId, userId, user, a) : []))
        .then((activity) => this.handleActivities(activity))
    } else {
      return upsertPromise
    }
  }

  public async handleLocationChangeActivity(
    userId: string,
    user: Readonly<FriendInformation>,
    location: Readonly<LocationInstanceOverview> | null,
    detailPendingPromise?: Readonly<Promise<LocationInstanceOverview | null>>
  ) {
    const activityId = generateFriendActivityId()
    const activity = toFriendLocationActivity(activityId, userId, user, location)
    const upsertPromise = this.handleActivities(activity)

    if (detailPendingPromise) {
      return Promise.all([upsertPromise, detailPendingPromise])
        .then(([, l]) => (l ? toFriendLocationActivity(activityId, userId, user, l) : []))
        .then((activity) => this.handleActivities(activity))
    } else {
      return upsertPromise
    }
  }

  public async handleAttributeChangeActivities(
    userId: string,
    user: Readonly<FriendInformation>,
    detailDiff: Readonly<DiffResult<BaseFriendInformation>['diff']>,
    updatedKeys: Readonly<DiffResult<BaseFriendInformation>['keys']>
  ) {
    const activities = toFriendAttributeActivities(userId, user, detailDiff, updatedKeys)
    return this.handleActivities(activities)
  }

  public async handleFriendAddActivity(userId: string, user: Readonly<FriendInformation>) {
    const activity = toFriendCommonActivity(userId, user, FriendActivityEvents.NewFriend)
    return this.handleActivities(activity)
  }

  public async handleFriendDeleteActivity(userId: string, user: Readonly<FriendInformation>) {
    const activity = toFriendCommonActivity(userId, user, FriendActivityEvents.RemovedFriend)
    return this.handleActivities(activity)
  }
}
