import { Authentication } from './authentication'
import { Avatars } from './avatars'
import { Favorites } from './favorites'
import { Friends } from './friends'
import { Worlds } from './worlds'
import { Groups } from './groups'
import { Users } from './users'
import { Notifications } from './notification'
import type { Got } from 'got'

export class VRChatAPI {
  public readonly client: Got
  public readonly authentication: Authentication
  public readonly avatars: Avatars
  public readonly friends: Friends
  public readonly favorites: Favorites
  public readonly groups: Groups
  public readonly worlds: Worlds
  public readonly users: Users
  public readonly notifications: Notifications

  constructor(got: Got) {
    this.client = got
    this.authentication = new Authentication(this.client)
    this.avatars = new Avatars(this.client)
    this.friends = new Friends(this.client)
    this.favorites = new Favorites(this.client)
    this.groups = new Groups(this.client)
    this.worlds = new Worlds(this.client)
    this.users = new Users(this.client)
    this.notifications = new Notifications(this.client)
  }
}
