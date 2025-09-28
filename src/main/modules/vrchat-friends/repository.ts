import Nanobus from 'nanobus'
import type { MobxState } from '../mobx-state'
import type { FriendInformation } from '@shared/definition/vrchat-friends'
import type { FriendSharedState } from '@shared/definition/mobx-shared'

export class FriendsRepository extends Nanobus<{
  'friends:insert': (friends: FriendInformation[]) => void
  'friends:update': (friends: FriendInformation[]) => void
  'friends:delete': (userId: string) => void
  'friends:clear': () => void
}> {
  private readonly friends = new Map<string, FriendInformation>()
  private friendUserIds: string[] = []
  private $!: FriendSharedState

  constructor(
    moduleId: string,
    private readonly mobx: MobxState
  ) {
    super('VRChatFriends:Repository')
    this.$ = this.mobx.observable(
      moduleId,
      {
        loading: false
      },
      ['loading']
    )
  }

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

  public async update(
    userId: string,
    callback: () => Promise<Partial<FriendInformation>> | Partial<FriendInformation>
  ) {
    if (!this.has(userId)) {
      return
    }

    const diff = await callback()
    const friend = this.get(userId)!
    const newFriend = {
      ...friend,
      ...diff
    }

    this.set(newFriend)
    this.emit('friends:update', [newFriend])
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

  public has(userId: string) {
    return this.friends.has(userId)
  }

  public setLoadingState(loading: boolean): void {
    this.mobx.action(() => {
      this.$.loading = loading
    })
  }

  public setFriendUserIds(userIds: string[]) {
    this.friendUserIds = userIds
  }

  public appendFriendUserIds(userIds: string[]) {
    this.friendUserIds = [...this.friendUserIds, ...userIds]
  }

  public getFriendUserIndex(userId: string) {
    return this.friendUserIds.indexOf(userId)
  }

  public get State(): FriendSharedState {
    return this.$
  }

  public get friendCount() {
    return this.friends.size
  }

  public get isLoading(): boolean {
    return this.$.loading
  }
}
