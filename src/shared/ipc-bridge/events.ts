import type { AuthenticationUserOverview } from '@main/modules/vrchat-authentication/types'
import { CurrentUser, TwoFactorTypes } from '@shared/types/vrchat-api-response'
import type { ResponseErrorReason } from '@shared/types/vrchat-api-status'

export type IpcListenerEvents = {
  ping: [number]
}

export type IpcRendererEvent = {
  'vrchat-authentication:state:logging-out': []
  'vrchat-authentication:state:unauthenticated': []
  'vrchat-authentication:state:authenticating': [
    AuthenticationUserOverview // userOverview
  ]
  'vrchat-authentication:state:error': [
    AuthenticationUserOverview, // userOverview
    ResponseErrorReason // error
  ]
  'vrchat-authentication:state:authenticated': [
    AuthenticationUserOverview, // userOverview
    CurrentUser, // userInfo
    string, // authToken
    string // twoFactorAuthToken
  ]
  'vrchat-authentication:state:twofa-verifying': [
    AuthenticationUserOverview // userOverview
  ]
  'vrchat-authentication:state:twofa-required': [
    AuthenticationUserOverview, // userOverview
    TwoFactorTypes[] // twoFactorAuthMethods
  ]
}
