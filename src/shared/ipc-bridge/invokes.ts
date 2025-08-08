import { AuthenticationUserOverview } from '@shared/types/vrchat-authentication'

export type IpcInvokeEvents = {
  'vrchat-authentication:login-with-credential': (
    username: string,
    password: string,
    twoFactorAuthToken?: string
  ) => void
  'vrchat-authentication:login-with-authtoken': (
    overview: AuthenticationUserOverview,
    authToken: string,
    twoFactorAuthToken?: string
  ) => void
  'vrchat-authentication:verify-totp': (code: string) => void
  'vrchat-authentication:verify-email-otp': (code: string) => void
  'vrchat-authentication:verify-recovery-otp': (code: string) => void
  'vrchat-authentication:logout': () => void
  'vrchat-authentication:reset': () => void
}
