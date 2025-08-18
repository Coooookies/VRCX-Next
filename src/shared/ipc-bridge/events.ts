import type { InstanceProperties, SettingDefinition } from '@shared/definition/setting'
import type { AuthenticationState } from '@shared/definition/vrchat-authentication'
import type { FriendInformation } from '@shared/definition/vrchat-friends'

export type IpcListenerEvents = {
  ping: [number]
}

export type IpcRendererEvent = {
  // MobxState
  'mobx-state:target:update': [namespace: string, path: string, value: unknown]

  // VRChatAuthentication
  'vrchat-authentication:state:update': [state: AuthenticationState]

  // VRChatFriends
  // 'vrchat-friends:friend:delete': [userId: string]
  // 'vrchat-friends:friend:add': [user: FriendInformation]
  // 'vrchat-friends:friend:online': [user: FriendInformation]
  // 'vrchat-friends:friend:offline': [user: FriendInformation]
  // 'vrchat-friends:friend:location': [user: FriendInformation]
  // 'vrchat-friends:friend:active': [user: FriendInformation]
  // 'vrchat-friends:friend:update': [user: FriendInformation, diff: Partial<BaseFriendInformation>]
  'vrchat-friends:friend:list-insert': [users: FriendInformation[]]
  'vrchat-friends:friend:list-update': [users: FriendInformation[]]
  'vrchat-friends:friend:list-delete': [userId: string]
  'vrchat-friends:friend:list-clear': []

  // SettingModule
  'setting-module:update': [property: InstanceProperties<SettingDefinition>]
}
