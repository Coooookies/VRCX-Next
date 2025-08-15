import type { AuthenticationUserOverview } from '@shared/definition/vrchat-authentication'
import type { CurrentUser, TwoFactorTypes } from '@shared/definition/vrchat-api-response'
import type { ResponseErrorReason } from '@shared/definition/vrchat-api-status'

export type AuthenticationEvent =
  | {
      type: 'LOGIN_WITH_CREDENTIAL'
      username: string
      password: string
      twoFactorAuthToken?: string
    }
  | {
      type: 'LOGIN_WITH_AUTHTOKEN'
      overview: AuthenticationUserOverview
      authToken: string
      twoFactorAuthToken?: string
    }
  | { type: 'VERIFY_TOTP'; code: string }
  | { type: 'VERIFY_EMAIL_OTP'; code: string }
  | { type: 'VERIFY_RECOVERY_OTP'; code: string }
  | { type: 'RESEND_EMAIL_OTP' }
  | { type: 'LOGOUT' }
  | { type: 'RESET' }

export interface AuthenticationLoginResponse {
  success: boolean
  userInfo?: CurrentUser
  userOverview?: AuthenticationUserOverview
  authToken?: string
  twoFactorAuthToken?: string
  twoFactorAuthRequired?: boolean
  twoFactorAuthMethods?: TwoFactorTypes[]
  error?: ResponseErrorReason
}

export interface AuthenticationLoginSuccessResponse extends AuthenticationLoginResponse {
  success: true
  userInfo: CurrentUser
  userOverview: AuthenticationUserOverview
  authToken: string
  twoFactorAuthRequired: false
}

export interface AuthenticationLogin2FARequiredResponse extends AuthenticationLoginResponse {
  success: true
  userOverview: AuthenticationUserOverview
  authToken: string
  twoFactorAuthRequired: true
  twoFactorAuthMethods: TwoFactorTypes[]
}

export interface AuthenticationLoginFailedResponse extends AuthenticationLoginResponse {
  success: false
  userOverview: AuthenticationUserOverview
  twoFactorAuthRequired: false
  error: ResponseErrorReason
}

export type AuthenticationLoginResult =
  | AuthenticationLoginSuccessResponse
  | AuthenticationLogin2FARequiredResponse
  | AuthenticationLoginFailedResponse

export interface AuthenticationVerify2FAResponse {
  success: boolean
  twoFactorAuthToken?: string
  error?: ResponseErrorReason
}

export interface AuthenticationVerify2FASuccessResponse extends AuthenticationVerify2FAResponse {
  success: true
  twoFactorAuthToken: string
}

export interface AuthenticationVerify2FAFailedResponse extends AuthenticationVerify2FAResponse {
  success: false
  error: ResponseErrorReason
}

export type AuthenticationVerify2FAResult =
  | AuthenticationVerify2FASuccessResponse
  | AuthenticationVerify2FAFailedResponse

export interface AuthenticationContext {
  authToken?: string
  authSuccess: boolean
  verify2FASuccess: boolean
  userOverview?: AuthenticationUserOverview
  userInfo?: CurrentUser
  password?: string
  twoFactorAuthToken?: string
  twoFactorAuthRequired: boolean
  twoFactorAuthMethods: TwoFactorTypes[]
  error?: ResponseErrorReason
}

export type { AuthenticationUserOverview } from '@shared/definition/vrchat-authentication'
export type { AuthenticationState } from '@shared/definition/vrchat-authentication'
