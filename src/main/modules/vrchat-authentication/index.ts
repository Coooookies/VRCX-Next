import { createActor } from 'xstate'
import { createLogger } from '@main/logger'
import { createAuthenticationMachine } from './state-machine'
import { createAuthenticationLogic } from './state-logic'
import { snapshotToAuthenticationState } from './factory'
import { AuthenticationRepository } from './repository'
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

  private readonly logger = createLogger('VRChatAuthentication')

  private state!: ActorRefFrom<typeof createAuthenticationMachine>
  private binding!: AuthenticationIPCBinding
  private repository!: AuthenticationRepository

  protected async onInit(): Promise<void> {
    const logic = createAuthenticationLogic(this.api)
    const machine = createAuthenticationMachine(logic)

    this.repository = new AuthenticationRepository(this.database)
    this.binding = new AuthenticationIPCBinding(this, this.ipc, this.repository)
    this.state = createActor(machine)
    this.state.start()
    this.binding.bindEvents()
    this.binding.bindInvokes()
    this.bindEvents()
  }

  protected onLoad(): void {
    this.resumeLoginSession()
  }

  private bindEvents() {
    this.state.subscribe(({ context, value }) => {
      this.logger.info('State updated:', value)
      this.emit('state:update', snapshotToAuthenticationState(context, value))
    })

    // auto save credentials when authenticated
    this.on('state:update', (state) => {
      const { auto_save_credentials } = this.currentSetting

      if (state.type === 'authenticated') {
        if (auto_save_credentials) {
          const userId = state.userInfo.id

          this.setting.update('vrchat_authentication', 'logged_in', true)
          this.setting.update('vrchat_authentication', 'logged_in_user_id', userId)
          this.repository.upsertCredential({
            userId,
            userName: state.overview.username,
            displayName: state.overview.displayName,
            profileIconFileId: state.overview.profileThumbnailImageFileId || '',
            profileIconFileVersion: state.overview.profileThumbnailImageFileVersion || 0,
            token: state.authToken,
            twoFactorToken: state.twoFactorAuthToken,
            createdAt: new Date()
          })
        }
      } else {
        this.cancelAutoLoginSession()
      }
    })
  }

  private async resumeLoginSession() {
    const { logged_in, logged_in_user_id } = this.currentSetting

    if (logged_in && logged_in_user_id) {
      this.loginWithSavedCredential(logged_in_user_id)
    }
  }

  private async cancelAutoLoginSession() {
    if (!this.currentSetting.logged_in) {
      return
    }

    await this.setting.update('vrchat_authentication', 'logged_in', false)
    await this.setting.update('vrchat_authentication', 'logged_in_user_id', '')
  }

  public async login(username: string, password: string) {
    const credential = await this.repository.getCredentialByUserName(username)
    const twoFactorAuthToken = credential?.twoFactorToken

    this.logger.debug('twoFactorAuthToken', twoFactorAuthToken)

    await this.signout()
    return this.loginWithCredential(username, password, twoFactorAuthToken)
  }

  public async loginWithSavedCredential(userId: string) {
    const credential = await this.repository.getCredentialByUserId(userId)

    if (!credential) {
      return
    }

    const overview: AuthenticationUserOverview = {
      displayName: credential.displayName,
      username: credential.userName,
      profileThumbnailImageFileId: credential.profileIconFileId,
      profileThumbnailImageFileVersion: credential.profileIconFileVersion
    }

    await this.signout()
    return this.loginWithAuthToken(overview, credential.token, credential.twoFactorToken)
  }

  private loginWithCredential(username: string, password: string, twoFactorAuthToken?: string) {
    this.state.send({
      type: 'LOGIN_WITH_CREDENTIAL',
      username,
      password,
      twoFactorAuthToken
    })
  }

  private loginWithAuthToken(
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
    if (this.currentState.type === 'authenticated') {
      this.repository.deleteCredentialByUserId(this.currentState.userInfo.id)
    }

    this.state.send({ type: 'LOGOUT' })
    return this.cancelAutoLoginSession()
  }

  public signout() {
    this.state.send({ type: 'RESET' })
    return this.cancelAutoLoginSession()
  }

  public get currentState(): AuthenticationState {
    const { context, value } = this.snapshot
    return snapshotToAuthenticationState(context, value)
  }

  public get currentSetting() {
    return this.setting.resolveNamespace('vrchat_authentication')
  }

  public get snapshot(): SnapshotFrom<typeof createAuthenticationMachine> {
    return this.state.getSnapshot()
  }
}
