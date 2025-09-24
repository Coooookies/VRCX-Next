import type { BaseFriendInformation, FriendInformation } from '@shared/definition/vrchat-friends'

export type FriendProcessHandler = (queuingFriends: FriendInformation[]) => void
export type FriendUpdateDiff = {
  before: Partial<BaseFriendInformation>
  after: Partial<BaseFriendInformation>
}
