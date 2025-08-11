import type { VRChatAuthentication } from '.'
import type { IPCModule } from '../ipc'
import type { AuthenticationRepository } from './repository'

export class AuthenticationIPCBinding {
  constructor(
    private self: VRChatAuthentication,
    private ipc: IPCModule,
    private repository: AuthenticationRepository
  ) {}

  public bindEvents() {
    this.self.on('state:update', (...args) => {
      this.ipc.send('vrchat-authentication:state:update', ...args)
    })
  }

  public bindInvokes() {
    this.ipc.listener.handle('vrchat-authentication:state', () => {
      return this.self.currentState
    })

    this.ipc.listener.handle('vrchat-authentication:login', (_, ...args) => {
      return this.self.login(...args)
    })

    this.ipc.listener.handle('vrchat-authentication:login-with-saved-credential', (_, ...args) => {
      return this.self.loginWithSavedCredential(...args)
    })

    this.ipc.listener.handle('vrchat-authentication:resend-email-otp', () => {
      return this.self.resendEmailOTP()
    })

    this.ipc.listener.handle('vrchat-authentication:verify-totp', (_, code) => {
      return this.self.verifyTOTP(code)
    })

    this.ipc.listener.handle('vrchat-authentication:verify-email-otp', (_, code) => {
      return this.self.verifyEmailOTP(code)
    })

    this.ipc.listener.handle('vrchat-authentication:verify-recovery-otp', (_, code) => {
      return this.self.verifyRecoveryOTP(code)
    })

    this.ipc.listener.handle('vrchat-authentication:logout', () => {
      return this.self.logout()
    })

    this.ipc.listener.handle('vrchat-authentication:signout', () => {
      return this.self.signout()
    })

    this.ipc.listener.handle('vrchat-authentication:get-all-credentials', () => {
      return this.repository.getAllCredentials()
    })

    this.ipc.listener.handle('vrchat-authentication:get-resume-session-state', () => {
      return {
        loggedIn: this.self.currentSetting.logged_in,
        loggedInUserId: this.self.currentSetting.logged_in_user_id
      }
    })

    this.ipc.listener.handle('vrchat-authentication:delete-credential', (_, userId) => {
      return this.repository.deleteCredentialByUserId(userId)
    })
  }
}
