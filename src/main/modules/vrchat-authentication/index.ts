import { createActor } from 'xstate'
import { createAuthenticationMachine } from './state-machine'
import { createAuthenticationLogic } from './state-logic'
import { snapshotToAuthenticationState } from './factory'
import { AuthenticationIPCBinding } from './ipc-binding'
import { Dependency, Module } from '@shared/module-constructor'
import type { ActorRefFrom, SnapshotFrom } from 'xstate'
import type { IPCModule } from '../ipc'
import type { Database } from '../database'
import type { VRChatAPI } from '../vrchat-api'
import type { SettingModule } from '../setting'
import type { AuthenticationState, AuthenticationUserOverview } from './types'

export class VRChatAuthentication extends Module<{
  'state:update': (state: AuthenticationState) => void
}> {
  @Dependency('SettingModule') declare private setting: SettingModule
  @Dependency('Database') declare private database: Database
  @Dependency('IPCModule') declare private ipc: IPCModule
  @Dependency('VRChatAPI') declare private api: VRChatAPI

  private state!: ActorRefFrom<typeof createAuthenticationMachine>
  private binding!: AuthenticationIPCBinding

  protected async onInit(): Promise<void> {
    const logic = createAuthenticationLogic(this.api)
    const machine = createAuthenticationMachine(logic)

    this.binding = new AuthenticationIPCBinding(this, this.ipc)
    this.state = createActor(machine)
    this.state.start()
    this.binding.bindEvents()
    this.binding.bindInvokes()
    this.bindEvents()
  }

  private bindEvents() {
    this.state.subscribe(({ context, value }) => {
      this.emit('state:update', snapshotToAuthenticationState(context, value))
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

  public get currentState(): AuthenticationState {
    const { context, value } = this.snapshot
    return snapshotToAuthenticationState(context, value)
  }

  public get snapshot(): SnapshotFrom<typeof createAuthenticationMachine> {
    return this.state.getSnapshot()
  }
}
