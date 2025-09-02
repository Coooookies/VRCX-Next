import type { CurrentUser, TwoFactorTypes } from './vrchat-api-response'
import type { ResponseErrorReason } from './vrchat-api-status'

export interface AuthenticationUserOverview {
  displayName: string
  username: string
  profileThumbnailImageFileId?: string
  profileThumbnailImageFileVersion?: number
}

export interface AuthenticationCredentialEntity {
  userId: string
  userName: string
  displayName: string
  profileIconFileId: string
  profileIconFileVersion: number
  updatedAt: Date
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
  error?: ResponseErrorReason
}

export interface AuthenticationStateTwoFAVerifying {
  type: 'twofa-verifying'
  overview: AuthenticationUserOverview
  twoFactorAuthMethods: TwoFactorTypes[]
}

export type AuthenticationState =
  | AuthenticationStateUnauthenticated
  | AuthenticationStateLoggingOut
  | AuthenticationStateAuthenticating
  | AuthenticationStateError
  | AuthenticationStateAuthenticated
  | AuthenticationStateTwoFARequired
  | AuthenticationStateTwoFAVerifying

export type AuthenticationResumeSessionState = {
  loggedIn: boolean
  loggedInUserId?: string
}
