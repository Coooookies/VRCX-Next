import { toRef } from 'vue'
import { Dependency, Module } from '@shared/module-constructor'
import type { IPCRenderer } from './ipc'
import type { MobxRenderer } from './mobx-renderer'
import type { AuthenticationState } from '@shared/types/vrchat-authentication'
import type { AuthenticationSharedState } from '@shared/types/mobx-shared'

export class VRChatAuthentication extends Module<{
  'state:update': (state: AuthenticationState) => void
}> {
  @Dependency('IPCRenderer') declare private ipc: IPCRenderer
  @Dependency('MobxRenderer') declare private mobx: MobxRenderer

  private $!: AuthenticationSharedState

  protected onInit(): void {
    this.bindEvents()
    this.$ = this.mobx.use<AuthenticationSharedState>(this.moduleId)
  }

  private bindEvents() {
    this.ipc.listener.on('vrchat-authentication:state:update', (_, state) => {
      this.emit('state:update', state)
    })
  }

  public getState() {
    return this.ipc.emitter.invoke('vrchat-authentication:state')
  }

  public login(username: string, password: string) {
    return this.ipc.emitter.invoke('vrchat-authentication:login', username, password)
  }

  public loginWithSavedCredential(userId: string) {
    return this.ipc.emitter.invoke('vrchat-authentication:login-with-saved-credential', userId)
  }

  public verifyTOTP(code: string) {
    return this.ipc.emitter.invoke('vrchat-authentication:verify-totp', code)
  }

  public verifyEmailOTP(code: string) {
    return this.ipc.emitter.invoke('vrchat-authentication:verify-email-otp', code)
  }

  public verifyRecoveryOTP(code: string) {
    return this.ipc.emitter.invoke('vrchat-authentication:verify-recovery-otp', code)
  }

  public getAllCredentials() {
    return this.ipc.emitter.invoke('vrchat-authentication:get-all-credentials')
  }

  public getResumeSessionState() {
    return this.ipc.emitter.invoke('vrchat-authentication:get-resume-session-state')
  }

  public deleteCredential(userId: string) {
    return this.ipc.emitter.invoke('vrchat-authentication:delete-credential', userId)
  }

  public logout() {
    return this.ipc.emitter.invoke('vrchat-authentication:logout')
  }

  public signout() {
    return this.ipc.emitter.invoke('vrchat-authentication:signout')
  }

  public get state() {
    return toRef(this.$, 'state')
  }
}
