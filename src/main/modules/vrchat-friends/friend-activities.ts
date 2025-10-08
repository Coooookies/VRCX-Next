import { generateFriendActivityId } from './utils'
import type { FriendsRepository } from './repository'
import type { FriendInformation } from '@shared/definition/vrchat-friends'
import type { LocationInstanceOverview } from '@shared/definition/vrchat-instances'

export class FriendsActivities {
  constructor(private readonly repository: FriendsRepository) {}

  public async handleFriendLocationChange(
    userId: string,
    user: FriendInformation,
    location: LocationInstanceOverview | null
  ) {
    const activityId = generateFriendActivityId()

    console.log(userId, user, location)
    return activityId
  }
}
