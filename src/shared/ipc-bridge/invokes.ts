import type { SettingDefinition, SettingKey, SettingNamespace } from '@shared/definition/setting'
import type {
  AuthenticationCredentialEntity,
  AuthenticationResumeSessionState,
  AuthenticationState
} from '@shared/definition/vrchat-authentication'

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

  // Runtime
  'runtime:relaunch': () => void
}
