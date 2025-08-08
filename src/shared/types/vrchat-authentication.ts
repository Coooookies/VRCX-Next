import type { CurrentUser, TwoFactorTypes } from './vrchat-api-response'
import type { ResponseErrorReason } from './vrchat-api-status'

export interface AuthenticationUserOverview {
  displayName: string
  username: string
  profileThumbnailImageFileId?: string
  profileThumbnailImageFileVersion?: number
}

export interface AuthenticationStateUnauthenticated {
  type: 'unauthenticated'
}

export interface AuthenticationStateLoggingOut {
  type: 'logging-out'
}

export interface AuthenticationStateAuthenticating {
  type: 'authenticating'
  overview: AuthenticationUserOverview
}

export interface AuthenticationStateError {
  type: 'error'
  overview: AuthenticationUserOverview
  error: ResponseErrorReason
}

export interface AuthenticationStateAuthenticated {
  type: 'authenticated'
  overview: AuthenticationUserOverview
  userInfo: CurrentUser
  authToken: string
  twoFactorAuthToken: string
}

export interface AuthenticationStateTwoFARequired {
  type: 'twofa-required'
  overview: AuthenticationUserOverview
  twoFactorAuthMethods: TwoFactorTypes[]
}

export interface AuthenticationStateTwoFAVerifying {
  type: 'twofa-verifying'
  overview: AuthenticationUserOverview
}

export type AuthenticationState =
  | AuthenticationStateUnauthenticated
  | AuthenticationStateLoggingOut
  | AuthenticationStateAuthenticating
  | AuthenticationStateError
  | AuthenticationStateAuthenticated
  | AuthenticationStateTwoFARequired
  | AuthenticationStateTwoFAVerifying
