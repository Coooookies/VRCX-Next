import type {
  AuthenticationCredentialEntity,
  AuthenticationState
} from '@shared/types/vrchat-authentication'

export type IpcInvokeEvents = {
  // MobxState
  'mobx-state:get-all-original-targets': () => Record<string, object>

  // VRChatAuthentication
  'vrchat-authentication:state': () => AuthenticationState
  'vrchat-authentication:login': (username: string, password: string) => void
  'vrchat-authentication:login-with-saved-credential': (userId: string) => void
  'vrchat-authentication:resend-email-otp': () => void
  'vrchat-authentication:verify-totp': (code: string) => void
  'vrchat-authentication:verify-email-otp': (code: string) => void
  'vrchat-authentication:verify-recovery-otp': (code: string) => void
  'vrchat-authentication:get-all-credentials': () => AuthenticationCredentialEntity[]
  'vrchat-authentication:delete-credential': (userId: string) => void
  'vrchat-authentication:logout': () => void
  'vrchat-authentication:signout': () => void
}
