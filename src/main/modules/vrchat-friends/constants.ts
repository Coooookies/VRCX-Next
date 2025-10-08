import { FriendAttributeActivities } from '@shared/definition/vrchat-friends'

export const ONLINE_FRIENDS_QUERY_SIZE = 100
export const OFFLINE_FRIENDS_QUERY_SIZE = 100

export const CURRENT_INSTANCE_QUEUE_LIMIT = 10
export const CURRENT_INSTANCE_BATCH_QUEUE_LIMIT = 1

export const FRIEND_UPDATE_COMPARE_KEYS: FriendAttributeActivities[] =
  Object.values(FriendAttributeActivities)
