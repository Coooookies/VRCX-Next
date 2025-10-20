import { randomUUID } from 'node:crypto'
import { UserState } from '@shared/definition/vrchat-api-response'
import type { FriendInformation } from '@shared/definition/vrchat-friends'

export function generateFriendActivityId() {
  return `friactv_${randomUUID()}`
}

export function compareFriendStates(
  friendIds: Set<string>,
  friendInformation: Map<string, FriendInformation>,
  state: UserState
) {
  const targetFriends = [...friendInformation.values().filter((friend) => friend.state === state)]
  const missingFriendIds = new Set<string>()
  const redundantFriendIds = new Set<string>()

  for (const friendId of friendIds) {
    const friend = friendInformation.get(friendId)
    if (!friend) {
      missingFriendIds.add(friendId)
    }
  }

  for (const friend of targetFriends) {
    if (!friendIds.has(friend.userId)) {
      redundantFriendIds.add(friend.userId)
    }
  }

  return {
    missingFriendIds,
    redundantFriendIds
  }
}

export function compareMissingFriends(
  friendIds: Set<string>,
  friendInformation: Map<string, FriendInformation>
) {
  const missingFriendIds = new Set<string>()
  for (const friendId of friendIds) {
    if (!friendInformation.has(friendId)) {
      missingFriendIds.add(friendId)
    }
  }
  return missingFriendIds
}

export function transformWhereaboutsOfFriends(
  analyzedFriendIds: Record<
    UserState,
    { missingFriendIds: Set<string>; redundantFriendIds: Set<string> }
  >
) {
  const { online, offline, active } = analyzedFriendIds

  const newOnline = new Set<string>()
  const newOffline = new Set<string>()
  const newActive = new Set<string>()

  for (const id of online.missingFriendIds) {
    if (offline.redundantFriendIds.has(id) || active.redundantFriendIds.has(id)) {
      newOnline.add(id)
    }
  }

  for (const id of offline.missingFriendIds) {
    if (online.redundantFriendIds.has(id) || active.redundantFriendIds.has(id)) {
      newOffline.add(id)
    }
  }

  for (const id of active.missingFriendIds) {
    if (online.redundantFriendIds.has(id) || offline.redundantFriendIds.has(id)) {
      newActive.add(id)
    }
  }

  return {
    online: newOnline,
    offline: newOffline,
    active: newActive
  }
}
