import { createActor } from 'xstate'
import { createLogger } from '@main/logger'
import { createAuthenticationMachine } from './state-machine'
import { createAuthenticationLogic } from './state-logic'
import { parseFileUrl } from '../vrchat-files/factory'
import { getProfileIconUrl } from '../vrchat-users/factory'
import { snapshotToAuthenticationState } from './factory'
import { AuthenticationRepository } from './repository'
import { AuthenticationIPCBinding } from './ipc-binding'
import { Dependency, Module } from '@shared/module-constructor'
import type { ActorRefFrom, SnapshotFrom } from 'xstate'
import type { IPCModule } from '../ipc'
import type { Database } from '../database'
import type { VRChatAPI } from '../vrchat-api'
import type { MobxState } from '../mobx-state'
import type { SettingModule } from '../setting'
import type { AuthenticationState, AuthenticationUserOverview } from './types'

export class VRChatAuthentication extends Module<{
  'state:update': (state: AuthenticationState) => void
}> {
  @Dependency('SettingModule') declare private setting: SettingModule
  @Dependency('IPCModule') declare private ipc: IPCModule
  @Dependency('Database') declare private database: Database
  @Dependency('MobxState') declare private mobx: MobxState
  @Dependency('VRChatAPI') declare private api: VRChatAPI

  private readonly logger = createLogger('VRChatAuthentication')

  private state!: ActorRefFrom<typeof createAuthenticationMachine>
  private binding!: AuthenticationIPCBinding
  private repository!: AuthenticationRepository

  protected async onInit(): Promise<void> {
    const logic = createAuthenticationLogic(this.api)
    const machine = createAuthenticationMachine(logic)
    this.state = createActor(machine)
    this.state.start()

    this.repository = new AuthenticationRepository(this, this.mobx, this.database)
    this.binding = new AuthenticationIPCBinding(this, this.ipc, this.repository)
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
          const thumbnailUrl = getProfileIconUrl(state.userInfo)
          const thumbnailFile = parseFileUrl(thumbnailUrl)

          this.api.setToken(state.authToken, state.twoFactorAuthToken)
          this.setting.update('vrchat_authentication', 'logged_in', true)
          this.setting.update('vrchat_authentication', 'logged_in_user_id', userId)
          this.repository.upsertCredential({
            userId,
            userName: state.overview.username,
            displayName: state.userInfo.displayName,
            profileIconFileId: thumbnailFile.fileId,
            profileIconFileVersion: thumbnailFile.version,
            token: state.authToken,
            twoFactorToken: state.twoFactorAuthToken,
            updatedAt: new Date()
          })
        }
      } else {
        this.api.setToken()
        this.cancelAutoLoginSession()
      }

      this.repository.setState(state)
    })
  }

  private async resumeLoginSession() {
    const { logged_in, logged_in_user_id } = this.currentSetting

    if (logged_in && logged_in_user_id) {
      this.loginWithSavedCredential(logged_in_user_id)
    }
  }

  private cancelAutoLoginSession() {
    if (!this.currentSetting.logged_in) {
      return
    }

    return this.setting.update('vrchat_authentication', 'logged_in', false).then(() => {})
  }

  public async login(username: string, password: string) {
    await this.signout()
    const credential = await this.repository.getCredentialByUserName(username)
    const twoFactorAuthToken = credential?.twoFactorToken
    return this.loginWithCredential(username, password, twoFactorAuthToken)
  }

  public async loginWithSavedCredential(userId: string) {
    await this.signout()
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

  public resendEmailOTP() {
    this.state.send({ type: 'RESEND_EMAIL_OTP' })
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

    if (this.currentState.type !== 'unauthenticated') {
      this.state.send({ type: 'LOGOUT' })
    }

    return this.cancelAutoLoginSession()
  }

  public signout() {
    if (this.currentState.type !== 'unauthenticated') {
      this.state.send({ type: 'RESET' })
    }

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
