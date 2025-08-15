import type { CurrentUser, Platform, User, World } from './vrchat-api-response'

export interface PipelineUserPlatformHistory {
  platform: Platform
  recorded: string
  isMobile: boolean
}

export interface PipelineNotificationDetail {
  created_at: string
  details: unknown
  id: string
  message: string
  seen: boolean
  receiverUserId: string
  senderUserId: string
  senderUsername: string
  type: string
}

export interface PipelineEventFriendOffline {
  userId: string
  platform: Platform
}

export interface PipelineEventFriendOnline {
  userId: string
  user: User
  worldId: string
  world?: World
  platform: Platform
  location: string
  travelingToLocation: string
  canRequestInvite: boolean
}

export interface PipelineEventFriendLocation {
  userId: string
  user: User
  worldId: string
  world?: World
  platform: Platform
  location: string
  travelingToLocation: string
  canRequestInvite: boolean
}

export interface PipelineEventFriendUpdate {
  userId: string
  user: User
}

export interface PipelineEventFriendAdd {
  userId: string
  user: User
}

export interface PipelineEventFriendDelete {
  userId: string
  platform: Platform
}

export interface PipelineEventFriendActive {
  userId: string
  platform: Platform
  user: User
}

export interface PipelineEventUserUpdate {
  userId: string
  user: CurrentUser
}

export interface PipelineEventUserLocation {
  userId: string
  user: User
  location: string //'traveling:traveling'
  instance: string
  travelingToLocation: string
}

export const PipelineEvents = {
  Notification: 'notification',
  ResponseNotification: 'response-notification',
  SeeNotification: 'see-notification',
  HideNotification: 'hide-notification',
  ClearNotification: 'clear-notification',
  NotificationV2: 'notification-v2',
  NotificationV2Update: 'notification-v2-update',
  FriendAdd: 'friend-add',
  FriendDelete: 'friend-delete',
  FriendOnline: 'friend-online',
  FriendActive: 'friend-active',
  FriendOffline: 'friend-offline',
  FriendUpdate: 'friend-update',
  FriendLocation: 'friend-location',
  UserUpdate: 'user-update',
  UserLocation: 'user-location',
  UserBadgeAssigned: 'user-badge-assigned',
  UserBadgeUnassigned: 'user-badge-unassigned',
  ContentRefresh: 'content-refresh',
  ModifiedImageUpdate: 'modified-image-update',
  InstanceQueueJoined: 'instance-queue-joined',
  InstanceQueueReady: 'instance-queue-ready',
  GroupJoined: 'group-joined',
  GroupLeft: 'group-left',
  GroupMemberUpdated: 'group-member-updated',
  GroupRoleUpdated: 'group-role-updated'
} as const

export type PipelineEvents = (typeof PipelineEvents)[keyof typeof PipelineEvents]

export type PipelineEventDefinition = {
  [PipelineEvents.Notification]: {}
  [PipelineEvents.ResponseNotification]: {}
  [PipelineEvents.SeeNotification]: {}
  [PipelineEvents.HideNotification]: {}
  [PipelineEvents.ClearNotification]: {}
  [PipelineEvents.NotificationV2]: {}
  [PipelineEvents.NotificationV2Update]: {}
  [PipelineEvents.FriendOffline]: PipelineEventFriendOffline
  [PipelineEvents.FriendOnline]: PipelineEventFriendOnline
  [PipelineEvents.FriendLocation]: PipelineEventFriendLocation
  [PipelineEvents.FriendUpdate]: PipelineEventFriendUpdate
  [PipelineEvents.FriendAdd]: PipelineEventFriendAdd
  [PipelineEvents.FriendDelete]: PipelineEventFriendDelete
  [PipelineEvents.FriendActive]: PipelineEventFriendActive
  [PipelineEvents.UserUpdate]: PipelineEventUserUpdate
  [PipelineEvents.UserLocation]: PipelineEventUserLocation
  [PipelineEvents.UserBadgeAssigned]: {}
  [PipelineEvents.UserBadgeUnassigned]: {}
  [PipelineEvents.ContentRefresh]: {}
  [PipelineEvents.ModifiedImageUpdate]: {}
  [PipelineEvents.InstanceQueueJoined]: {}
  [PipelineEvents.InstanceQueueReady]: {}
  [PipelineEvents.GroupJoined]: {}
  [PipelineEvents.GroupLeft]: {}
  [PipelineEvents.GroupMemberUpdated]: {}
  [PipelineEvents.GroupRoleUpdated]: {}
}

export type PipelineEventMessage = {
  [K in PipelineEvents]: {
    type: K
    content: PipelineEventDefinition[K]
  }
}[PipelineEvents]
