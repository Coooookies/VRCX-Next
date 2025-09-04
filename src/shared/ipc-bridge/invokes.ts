import type { FriendInformation } from '@shared/definition/vrchat-friends'
import type { SettingDefinition, SettingKey, SettingNamespace } from '@shared/definition/setting'
import type { NotificationInformation } from '@shared/definition/vrchat-notifications'
import type { NotificationV2ResponseType } from '@shared/definition/vrchat-api-response'
import type {
  AuthenticationCredentialEntity,
  AuthenticationResumeSessionState,
  AuthenticationState
} from '@shared/definition/vrchat-authentication'
import type { ImageSelectionInstance } from '@shared/definition/image-selection'

export type IpcInvokeEvents = {
  // MobxState
  'mobx-state:get-all-original-targets': () => Record<string, object>

  // SettingModule
  'setting-module:update': <T extends SettingNamespace, K extends SettingKey<T>>(
    namespace: T,
    key: K,
    value: SettingDefinition[T][K]
  ) => void

  // VRChatAuthentication
  'vrchat-authentication:state': () => AuthenticationState
  'vrchat-authentication:login': (username: string, password: string) => void
  'vrchat-authentication:login-with-saved-credential': (userId: string) => void
  'vrchat-authentication:resend-email-otp': () => void
  'vrchat-authentication:verify-totp': (code: string) => void
  'vrchat-authentication:verify-email-otp': (code: string) => void
  'vrchat-authentication:verify-recovery-otp': (code: string) => void
  'vrchat-authentication:get-all-credentials': () => AuthenticationCredentialEntity[]
  'vrchat-authentication:get-resume-session-state': () => AuthenticationResumeSessionState
  'vrchat-authentication:delete-credential': (userId: string) => void
  'vrchat-authentication:logout': () => void
  'vrchat-authentication:signout': () => void

  // VRChatFriends
  'vrchat-friends:get-friends': () => FriendInformation[]

  // VRChatNotifications
  'vrchat-notifications:get-notifications': () => NotificationInformation[]
  'vrchat-notifications:mark-notification-as-read': (notificationId: string) => void
  'vrchat-notifications:delete-notification-v1': (notificationId: string) => void
  'vrchat-notifications:delete-notification-v2': (notificationId: string) => void
  'vrchat-notifications:clear-notifications': () => void
  'vrchat-notifications:respond-notification-v2': (
    notificationId: string,
    type: NotificationV2ResponseType,
    data: string
  ) => void

  // ImageSelection
  'image-selection:select-image': (
    title: string,
    multiSelections?: boolean
  ) => Promise<ImageSelectionInstance[] | null>
  'image-selection:get-latest-selections': (limit: number) => Promise<ImageSelectionInstance[]>
  'image-selection:get-selection': (selectionId: string) => Promise<ImageSelectionInstance | null>

  // Runtime
  'runtime:relaunch': () => void
}
