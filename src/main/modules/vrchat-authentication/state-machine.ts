import { fromPromise, assign, setup } from 'xstate'
import { AuthenticationStateLogic } from './state-logic'
import type { VRChatAPI } from '../vrchat-api'
import type { AuthenticationContext, AuthenticationEvent } from './types'

// stateDiagram-v2
//     [*] --> unauthenticated
//     unauthenticated --> credential_authenticating : Login with credential
//     unauthenticated --> authtoken_authenticating : Login with authtoken
//     credential_authenticating --> authenticated : Login Success
//     credential_authenticating --> twofa_required : Require 2FA
//     credential_authenticating --> error : Login Failed
//     authtoken_authenticating --> authenticated : Login Success
//     authtoken_authenticating --> twofa_required : Require 2FA
//     authtoken_authenticating --> error : Login Failed
//     twofa_required --> twofa_verifying : VERIFY_TOTP / VERIFY_EMAIL_OTP / VERIFY_RECOVERY_OTP
//     twofa_verifying --> authtoken_authenticating : 2FA Success and Relogin
//     twofa_verifying --> twofa_required : 2FA Failed
//     error --> unauthenticated : RESET
//     authenticated --> unauthenticated : LOGOUT

export function createAuthenticationMachine(api: VRChatAPI) {
  const logic = new AuthenticationStateLogic(api)
  const prebuild = setup({
    types: {
      context: {} as AuthenticationContext,
      events: {} as AuthenticationEvent
    },
    actors: {
      credential_login: fromPromise(({ input }: { input: { event: AuthenticationEvent } }) => {
        if (input.event.type !== 'LOGIN_WITH_CREDENTIAL') {
          throw new Error('Unknown event type for login')
        }

        return logic.loginWithCredential(
          input.event.username,
          input.event.password,
          input.event.twoFactorAuthToken
        )
      }),
      authtoken_login: fromPromise(({ input }: { input: { context: AuthenticationContext } }) => {
        const { context } = input
        return logic.loginWithAuthToken(
          context.authToken!,
          context.userOverview!,
          context.twoFactorAuthToken!
        )
      }),
      verify2FA: fromPromise(
        ({ input }: { input: { context: AuthenticationContext; event: AuthenticationEvent } }) => {
          const { context, event } = input
          const token = context.authToken!

          switch (event.type) {
            case 'VERIFY_EMAIL_OTP':
              return logic.verify2FACode(token, 'emailOtp', event.code)
            case 'VERIFY_RECOVERY_OTP':
              return logic.verify2FACode(token, 'otp', event.code)
            case 'VERIFY_TOTP':
              return logic.verify2FACode(token, 'totp', event.code)
            default:
              throw new Error('Unknown event type for verify2FA')
          }
        }
      ),
      logout: fromPromise(({ input }: { input: { context: AuthenticationContext } }) => {
        return logic.logout(input.context.authToken!)
      })
    },
    guards: {
      is2FARequired({ context }) {
        return context.authSuccess && context.twoFactorAuthRequired
      },
      isAuthenticated({ context }) {
        return context.authSuccess && !context.twoFactorAuthRequired
      },
      isAuthenticateError({ context }) {
        return !context.authSuccess
      },
      is2FAVerified({ context }) {
        return context.verify2FASuccess
      },
      is2FAStillRequired({ context }) {
        return !context.verify2FASuccess
      }
    }
  })

  return prebuild.createMachine({
    id: 'vrchat-authentication',
    initial: 'unauthenticated',
    context: {
      authSuccess: false,
      verify2FASuccess: false,
      twoFactorAuthRequired: false,
      twoFactorAuthMethods: []
    },
    states: {
      unauthenticated: {
        entry: assign(() => ({
          authSuccess: false,
          authToken: undefined,
          verify2FASuccess: false,
          userOverview: undefined,
          userInfo: undefined,
          twoFactorAuthToken: undefined,
          twoFactorAuthRequired: false,
          twoFactorAuthMethods: [],
          error: undefined
        })),
        on: {
          LOGIN_WITH_CREDENTIAL: {
            target: 'credential_authenticating',
            actions: assign(({ event }) => ({
              twoFactorAuthToken: event.twoFactorAuthToken,
              userOverview: {
                displayName: event.username,
                username: event.username
              }
            }))
          },
          LOGIN_WITH_AUTHTOKEN: {
            target: 'authtoken_authenticating',
            actions: assign(({ event }) => ({
              authToken: event.authToken,
              twoFactorAuthToken: event.twoFactorAuthToken,
              userOverview: event.overview
            }))
          }
        }
      },
      credential_authenticating: {
        invoke: {
          id: 'credential_authenticating',
          src: 'credential_login',
          input: (ctx) => ctx,
          onDone: {
            target: 'authenticating_redirect',
            actions: assign(({ event }) => ({
              authSuccess: event.output.success,
              userOverview: event.output.userOverview,
              userInfo: event.output.userInfo,
              authToken: event.output.authToken,
              twoFactorAuthToken: event.output.twoFactorAuthToken,
              twoFactorAuthRequired: event.output.twoFactorAuthRequired,
              twoFactorAuthMethods: event.output.twoFactorAuthMethods || [],
              error: event.output.error
            }))
          }
        }
      },
      authtoken_authenticating: {
        invoke: {
          id: 'authtoken_authenticating',
          src: 'authtoken_login',
          input: (ctx) => ctx,
          onDone: {
            target: 'authenticating_redirect',
            actions: assign(({ event }) => ({
              authSuccess: event.output.success,
              userOverview: event.output.userOverview,
              userInfo: event.output.userInfo,
              authToken: event.output.authToken,
              twoFactorAuthToken: event.output.twoFactorAuthToken,
              twoFactorAuthRequired: event.output.twoFactorAuthRequired,
              twoFactorAuthMethods: event.output.twoFactorAuthMethods || [],
              error: event.output.error
            }))
          }
        }
      },
      authenticating_redirect: {
        always: [
          { guard: 'isAuthenticateError', target: 'error' },
          { guard: 'isAuthenticated', target: 'authenticated' },
          { guard: 'is2FARequired', target: 'twofa_required' }
        ]
      },
      twofa_required: {
        on: {
          VERIFY_TOTP: 'twofa_verifying',
          VERIFY_EMAIL_OTP: 'twofa_verifying',
          VERIFY_RECOVERY_OTP: 'twofa_verifying',
          RESET: 'unauthenticated',
          LOGOUT: 'logging_out'
        }
      },
      twofa_verifying: {
        invoke: {
          id: 'request-verify-2fa',
          src: 'verify2FA',
          input: (ctx) => ctx,
          onDone: {
            target: 'twofa_verify_redirect',
            actions: assign(({ event }) => ({
              verify2FASuccess: event.output.success,
              twoFactorAuthToken: event.output.twoFactorAuthToken,
              error: event.output.error
            }))
          }
        }
      },
      twofa_verify_redirect: {
        always: [
          { guard: 'is2FAVerified', target: 'authtoken_authenticating' },
          { guard: 'is2FAStillRequired', target: 'twofa_required' }
        ]
      },
      authenticated: {
        on: {
          LOGOUT: 'logging_out'
        }
      },
      logging_out: {
        invoke: {
          id: 'request-logging-out',
          src: 'logout',
          input: (ctx) => ctx,
          onDone: {
            target: 'unauthenticated'
          }
        }
      },
      error: {
        on: {
          RESET: 'unauthenticated'
        }
      }
    }
  })
}
