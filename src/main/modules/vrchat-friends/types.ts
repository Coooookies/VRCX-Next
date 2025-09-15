import type { FriendInformation } from '@shared/definition/vrchat-friends'
export type FriendProcessHandler = (queuingFriends: FriendInformation[]) => void
