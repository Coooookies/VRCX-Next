import type { InstanceProperties, SettingDefinition } from '@shared/definition/setting'
import type { AuthenticationState } from '@shared/definition/vrchat-authentication'
import type { FriendInformation } from '@shared/definition/vrchat-friends'
import type {
  InstanceEventMessage,
  InstanceUserWithInformation
} from '@shared/definition/vrchat-instances'
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
  'vrchat-instances:instance-tracker:append-events': [events: InstanceEventMessage[]]
  'vrchat-instances:instance-tracker:update-event': [eventId: string, event: InstanceEventMessage]
  'vrchat-instances:instance-tracker:remove-user': [userId: string]
  'vrchat-instances:instance-tracker:insert-users': [users: InstanceUserWithInformation[]]
  'vrchat-instances:instance-tracker:update-user': [
    userId: string,
    user: InstanceUserWithInformation
  ]
  'vrchat-instances:instance-tracker:clear': []

  // SettingModule
  'setting-module:update': [property: InstanceProperties<SettingDefinition>]
}
