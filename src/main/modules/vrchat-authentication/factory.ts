import { createAuthenticationMachine } from './state-machine'
import type { SnapshotFrom } from 'xstate'
import type { AuthenticationContext, AuthenticationState } from './types'

export function snapshotToAuthenticationState(
  context: AuthenticationContext,
  value: SnapshotFrom<typeof createAuthenticationMachine>['value']
): AuthenticationState {
  const { authToken, userOverview, userInfo, twoFactorAuthToken, twoFactorAuthMethods, error } =
    context

  switch (value) {
    case 'unauthenticated': {
      return { type: 'unauthenticated' }
    }
    case 'logging_out': {
      return { type: 'logging-out' }
    }
    case 'credential_authenticating':
    case 'authtoken_authenticating': {
      return { type: 'authenticating', overview: userOverview! }
    }
    case 'error': {
      return { type: 'error', overview: userOverview!, error: error! }
    }
    case 'authenticated': {
      return {
        type: 'authenticated',
        overview: userOverview!,
        userInfo: userInfo!,
        authToken: authToken!,
        twoFactorAuthToken: twoFactorAuthToken!
      }
    }
    case 'twofa_required': {
      return {
        type: 'twofa-required',
        overview: userOverview!,
        twoFactorAuthMethods: twoFactorAuthMethods,
        error: error
      }
    }
    case 'twofa_verifying': {
      return {
        type: 'twofa-verifying',
        overview: userOverview!,
        twoFactorAuthMethods: twoFactorAuthMethods
      }
    }
    default: {
      throw new Error(`Unknown authentication state: ${value}`)
    }
  }
}
