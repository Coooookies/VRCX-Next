import type {
  CurrentUser,
  GroupLimitedMember,
  GroupRole,
  InventoryItemType,
  Notification,
  NotificationV2,
  Platform,
  User,
  World
} from './vrchat-api-response'

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
  user: User
  platform: Platform
}

export interface PipelineEventUserUpdate {
  userId: string
  user: CurrentUser
}

export interface PipelineEventUserLocation {
  userId: string
  user: User
  location: string
  instance: string
  travelingToLocation: string
}

export interface PipelineEventUserBadgeAssigned {
  badge: string
}

export interface PipelineEventUserBadgeUnassigned {
  badgeId: string
}

export const PipelineEventContentRefreshContentType = {
  Gallery: 'gallery',
  Icon: 'icon',
  Emoji: 'emoji',
  World: 'world',
  Avatar: 'avatar'
}

export type PipelineEventContentRefreshContentType =
  (typeof PipelineEventContentRefreshContentType)[keyof typeof PipelineEventContentRefreshContentType]

export const PipelineEventContentRefreshActionType = {
  Created: 'created',
  Updated: 'updated',
  Deleted: 'deleted'
}

export type PipelineEventContentRefreshActionType =
  (typeof PipelineEventContentRefreshActionType)[keyof typeof PipelineEventContentRefreshActionType]

export interface PipelineEventContentRefresh {
  contentType: PipelineEventContentRefreshContentType
  fileId: string
  itemId: string
  itemType: InventoryItemType
  actionType: PipelineEventContentRefreshActionType
}

export interface PipelineEventModifiedImageUpdate {
  fileId: string
  pixelSize: number
  versionNumber: number
  needsProcessing: boolean
}

export interface PipelineEventInstanceQueueJoined {
  instanceLocation: string
  position: number
}

export interface PipelineEventInstanceQueuePosition {
  instanceLocation: string
  position: number
  queueSize: number
}

export interface PipelineEventInstanceQueueReady {
  instanceLocation: string
  expiry: string
}

export interface PipelineEventGroupJoined {
  groupId: string
}

export interface PipelineEventGroupLeft {
  groupId: string
}

export interface PipelineEventGroupMemberUpdated {
  member: GroupLimitedMember
}

export interface PipelineEventGroupRoleUpdated {
  role: GroupRole
}

export type PipelineEventNotification = Notification

export interface PipelineEventResponseNotification {
  notificationId: string
  receiverId: string
  responseId: string
}

export type PipelineEventSeeNotification = string
export type PipelineEventHideNotification = string
export type PipelineEventClearNotification = never

export type PipelineEventNotificationV2 = NotificationV2

export interface PipelineEventNotificationV2Update {
  id: string
  version: number
  updates: Partial<NotificationV2>
}

export interface PipelineEventNotificationV2Delete {
  ids: string[]
  version: number
}

export const PipelineEvents = {
  Notification: 'notification',
  ResponseNotification: 'response-notification',
  SeeNotification: 'see-notification',
  HideNotification: 'hide-notification',
  ClearNotification: 'clear-notification',
  NotificationV2: 'notification-v2',
  NotificationV2Update: 'notification-v2-update',
  NotificationV2Delete: 'notification-v2-delete',
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
  InstanceQueuePosition: 'instance-queue-position',
  InstanceQueueReady: 'instance-queue-ready',
  GroupJoined: 'group-joined',
  GroupLeft: 'group-left',
  GroupMemberUpdated: 'group-member-updated',
  GroupRoleUpdated: 'group-role-updated'
} as const

export type PipelineEvents = (typeof PipelineEvents)[keyof typeof PipelineEvents]

export type PipelineEventDefinition = {
  [PipelineEvents.Notification]: PipelineEventNotification
  [PipelineEvents.ResponseNotification]: PipelineEventResponseNotification
  [PipelineEvents.SeeNotification]: PipelineEventSeeNotification
  [PipelineEvents.HideNotification]: PipelineEventHideNotification
  [PipelineEvents.ClearNotification]: PipelineEventClearNotification
  [PipelineEvents.NotificationV2]: PipelineEventNotificationV2
  [PipelineEvents.NotificationV2Update]: PipelineEventNotificationV2Update
  [PipelineEvents.NotificationV2Delete]: PipelineEventNotificationV2Delete
  [PipelineEvents.FriendOffline]: PipelineEventFriendOffline
  [PipelineEvents.FriendOnline]: PipelineEventFriendOnline
  [PipelineEvents.FriendLocation]: PipelineEventFriendLocation
  [PipelineEvents.FriendUpdate]: PipelineEventFriendUpdate
  [PipelineEvents.FriendAdd]: PipelineEventFriendAdd
  [PipelineEvents.FriendDelete]: PipelineEventFriendDelete
  [PipelineEvents.FriendActive]: PipelineEventFriendActive
  [PipelineEvents.UserUpdate]: PipelineEventUserUpdate
  [PipelineEvents.UserLocation]: PipelineEventUserLocation
  [PipelineEvents.UserBadgeAssigned]: PipelineEventUserBadgeAssigned
  [PipelineEvents.UserBadgeUnassigned]: PipelineEventUserBadgeUnassigned
  [PipelineEvents.ContentRefresh]: PipelineEventContentRefresh
  [PipelineEvents.ModifiedImageUpdate]: PipelineEventModifiedImageUpdate
  [PipelineEvents.InstanceQueueJoined]: PipelineEventInstanceQueueJoined
  [PipelineEvents.InstanceQueuePosition]: PipelineEventInstanceQueuePosition
  [PipelineEvents.InstanceQueueReady]: PipelineEventInstanceQueueReady
  [PipelineEvents.GroupJoined]: PipelineEventGroupJoined
  [PipelineEvents.GroupLeft]: PipelineEventGroupLeft
  [PipelineEvents.GroupMemberUpdated]: PipelineEventGroupMemberUpdated
  [PipelineEvents.GroupRoleUpdated]: PipelineEventGroupRoleUpdated
}

export type PipelineEventMessage = {
  [K in PipelineEvents]: {
    type: K
    content: PipelineEventDefinition[K]
  }
}[PipelineEvents]
