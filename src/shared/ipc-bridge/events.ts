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
  'vrchat-friends:friend-sessions:present': [sfriends: FriendInformation[]]
  'vrchat-friends:friend-sessions:append': [friend: FriendInformation]
  'vrchat-friends:friend-sessions:remove': [friendUserId: string]
  'vrchat-friends:friend-sessions:update': [friendUserId: string, friend: FriendInformation]
  'vrchat-friends:friend-sessions:updates': [friends: FriendInformation[]]
  'vrchat-friends:friend-sessions:clear': []

  // VRChatNotifications
  'vrchat-notifications:notifications:present': [notifications: NotificationInformation[]]
  'vrchat-notifications:notifications:append': [notification: NotificationInformation]
  'vrchat-notifications:notifications:update': [
    notificationId: string,
    notifications: NotificationInformation
  ]
  'vrchat-notifications:notifications:remove': [notificationId: string]
  'vrchat-notifications:notifications:clear': [version: NotificationVersion]

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
