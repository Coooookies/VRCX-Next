import Nanobus from 'nanobus'
import type { FriendInformation } from '@shared/definition/vrchat-friends'

export class FriendsRepository extends Nanobus<{
  'friends:insert': (friends: FriendInformation[]) => void
  'friends:update': (friends: FriendInformation[]) => void
  'friends:delete': (userId: string) => void
  'friends:clear': () => void
}> {
  private readonly friends = new Map<string, FriendInformation>()

  public get(userId: string) {
    return this.friends.get(userId)
  }

  public getAll() {
    return [...this.friends.values()]
  }

  public set(friends: FriendInformation | FriendInformation[]) {
    const pendingFriends = Array.isArray(friends) ? friends : [friends]
    const pendingUpdateFriends: FriendInformation[] = []
    const pendingInsertFriends: FriendInformation[] = []

    for (const friend of pendingFriends) {
      if (this.has(friend.userId)) {
        pendingUpdateFriends.push(friend)
      } else {
        pendingInsertFriends.push(friend)
      }

      // Update the friend in the repository
      this.friends.set(friend.userId, friend)
    }

    if (pendingInsertFriends.length > 0) {
      this.emit('friends:insert', pendingInsertFriends)
    }

    if (pendingUpdateFriends.length > 0) {
      this.emit('friends:update', pendingUpdateFriends)
    }
  }

  public delete(userId: string) {
    const deleted = this.friends.delete(userId)
    if (deleted) {
      this.emit('friends:delete', userId)
    }
    return deleted
  }

  public clear() {
    this.friends.clear()
    this.emit('friends:clear')
  }

  public has(userId: string): boolean {
    return this.friends.has(userId)
  }
}
