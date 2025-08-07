import type { VRChatAuthentication } from '.'
import type { IPCModule } from '../ipc'

export class AuthenticationIPCBinding {
  constructor(
    private self: VRChatAuthentication,
    private ipc: IPCModule
  ) {}

  public bindEvents() {
    this.self.on('state:error', (...args) => {
      this.ipc.send('vrchat-authentication:state:error', ...args)
    })

    this.self.on('state:logging-out', () => {
      this.ipc.send('vrchat-authentication:state:logging-out')
    })

    this.self.on('state:unauthenticated', () => {
      this.ipc.send('vrchat-authentication:state:unauthenticated')
    })

    this.self.on('state:authenticating', (...args) => {
      this.ipc.send('vrchat-authentication:state:authenticating', ...args)
    })

    this.self.on('state:authenticated', (...args) => {
      this.ipc.send('vrchat-authentication:state:authenticated', ...args)
    })

    this.self.on('state:twofa-verifying', (...args) => {
      this.ipc.send('vrchat-authentication:state:twofa-verifying', ...args)
    })

    this.self.on('state:twofa-required', (...args) => {
      this.ipc.send('vrchat-authentication:state:twofa-required', ...args)
    })
  }

  public bindInvokes() {
    this.ipc.listener.handle('vrchat-authentication:login-with-credential', (_, ...args) => {
      return this.self.loginWithCredential(...args)
    })

    this.ipc.listener.handle('vrchat-authentication:login-with-authtoken', (_, ...args) => {
      return this.self.loginWithAuthToken(...args)
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

    this.ipc.listener.handle('vrchat-authentication:reset', () => {
      return this.self.reset()
    })
  }
}
