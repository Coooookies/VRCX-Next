import { createActor } from 'xstate'
import { createAuthenticationMachine } from './state-machine'
import { AuthenticationIPCBinding } from './ipc-binding'
import { Dependency, Module } from '@shared/module-constructor'
import type { ActorRefFrom } from 'xstate'
import type { IPCModule } from '../ipc'
import type { Database } from '../database'
import type { VRChatAPI } from '../vrchat-api'
import type { SettingModule } from '../setting'
import type { AuthenticationUserOverview } from './types'
import type { CurrentUser, TwoFactorTypes } from '@shared/types/vrchat-api-response'
import type { ResponseErrorReason } from '@shared/types/vrchat-api-status'

export class VRChatAuthentication extends Module<{
  'state:error': (userOverview: AuthenticationUserOverview, error: ResponseErrorReason) => void
  'state:logging-out': () => void
  'state:unauthenticated': () => void
  'state:authenticating': (userOverview: AuthenticationUserOverview) => void
  'state:authenticated': (
    userOverview: AuthenticationUserOverview,
    userInfo: CurrentUser,
    authToken: string,
    twoFactorAuthToken: string
  ) => void
  'state:twofa-verifying': (userOverview: AuthenticationUserOverview) => void
  'state:twofa-required': (
    userOverview: AuthenticationUserOverview,
    twoFactorAuthMethods: TwoFactorTypes[]
  ) => void
}> {
  @Dependency('SettingModule') declare private setting: SettingModule
  @Dependency('Database') declare private database: Database
  @Dependency('IPCModule') declare private ipc: IPCModule
  @Dependency('VRChatAPI') declare private api: VRChatAPI

  private state!: ActorRefFrom<typeof createAuthenticationMachine>
  private binding!: AuthenticationIPCBinding

  protected async onInit(): Promise<void> {
    const machine = createAuthenticationMachine(this.api)

    this.binding = new AuthenticationIPCBinding(this, this.ipc)
    this.state = createActor(machine)
    this.state.start()
    this.binding.bindEvents()
    this.binding.bindInvokes()
    this.bindEvents()
  }

  private bindEvents() {
    this.state.subscribe(({ context, value }) => {
      const { authToken, userOverview, userInfo, twoFactorAuthToken, twoFactorAuthMethods, error } =
        context

      switch (value) {
        case 'error': {
          this.emit('state:error', userOverview!, error!)
          break
        }
        case 'unauthenticated': {
          this.emit('state:unauthenticated')
          break
        }
        case 'credential_authenticating':
        case 'authtoken_authenticating': {
          this.emit('state:authenticating', userOverview!)
          break
        }
        case 'authenticated': {
          this.emit(
            'state:authenticated',
            userOverview!,
            userInfo!,
            authToken!,
            twoFactorAuthToken!
          )
          break
        }
        case 'twofa_required': {
          this.emit('state:twofa-required', userOverview!, twoFactorAuthMethods)
          break
        }
        case 'twofa_verifying': {
          this.emit('state:twofa-verifying', userOverview!)
          break
        }
        case 'logging_out': {
          this.emit('state:logging-out')
          break
        }
      }
    })
  }

  public loginWithCredential(username: string, password: string, twoFactorAuthToken?: string) {
    this.state.send({
      type: 'LOGIN_WITH_CREDENTIAL',
      username,
      password,
      twoFactorAuthToken
    })
  }

  public loginWithAuthToken(
    overview: AuthenticationUserOverview,
    authToken: string,
    twoFactorAuthToken?: string
  ) {
    this.state.send({
      type: 'LOGIN_WITH_AUTHTOKEN',
      overview,
      authToken,
      twoFactorAuthToken
    })
  }

  public verifyTOTP(code: string) {
    this.state.send({ type: 'VERIFY_TOTP', code })
  }

  public verifyEmailOTP(code: string) {
    this.state.send({ type: 'VERIFY_EMAIL_OTP', code })
  }

  public verifyRecoveryOTP(code: string) {
    this.state.send({ type: 'VERIFY_RECOVERY_OTP', code })
  }

  public logout() {
    this.state.send({ type: 'LOGOUT' })
  }

  public reset() {
    this.state.send({ type: 'RESET' })
  }
}
