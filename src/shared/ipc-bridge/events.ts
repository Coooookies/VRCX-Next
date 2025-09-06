import type { InstanceProperties, SettingDefinition } from '@shared/definition/setting'
import type { AuthenticationState } from '@shared/definition/vrchat-authentication'
import type { FriendInformation } from '@shared/definition/vrchat-friends'
import type { InstanceUserActivity, InstanceUserSummary } from '@shared/definition/vrchat-instances'
import type {
  NotificationInformation,
  NotificationVersion
} from '@shared/definition/vrchat-notifications'

export type IpcListenerEvents = {
  ping: [number]
}

export type IpcRendererEvent = {
  // MobxState
  'mobx-state:target:update': [namespace: string, path: string, value: unknown]

  // VRChatAuthentication
  'vrchat-authentication:state:update': [state: AuthenticationState]

  // VRChatFriends
  'vrchat-friends:friend:list-insert': [users: FriendInformation[]]
  'vrchat-friends:friend:list-update': [users: FriendInformation[]]
  'vrchat-friends:friend:list-delete': [userId: string]
  'vrchat-friends:friend:list-clear': []

  // VRChatNotifications
  'vrchat-notifications:notification:list-insert': [notifications: NotificationInformation[]]
  'vrchat-notifications:notification:list-update': [notifications: NotificationInformation[]]
  'vrchat-notifications:notification:list-delete': [notificationIds: string[]]
  'vrchat-notifications:notification:list-clear': [version: NotificationVersion]

  // VRChatInstances
  'vrchat-instances:current-instance:append-user-activities': [activities: InstanceUserActivity[]]
  'vrchat-instances:current-instance:append-users': [users: InstanceUserSummary[]]
  'vrchat-instances:current-instance:remove-users': [userId: string]
  'vrchat-instances:current-instance:clear-users': []
  'vrchat-instances:current-instance:clear-user-activities': []

  // SettingModule
  'setting-module:update': [property: InstanceProperties<SettingDefinition>]
}
