import { toRef } from 'vue'
import { useModule } from '@renderer/shared/hooks/use-module'
import type { SettingModule } from '@renderer/shared/modules/setting'
import type { VRChatAuthentication } from '@renderer/shared/modules/vrchat-authentication'

export function useAuthSubmit() {
  const auth = useModule<VRChatAuthentication>('VRChatAuthentication')
  const setting = useModule<SettingModule>('SettingModule')
  const saveCredentials = toRef(setting.state.vrchat_authentication, 'auto_save_credentials')

  async function login(username: string, password: string, saveCredentials: boolean) {
    await setting.update('vrchat_authentication', 'auto_save_credentials', saveCredentials)
    return auth.login(username, password)
  }

  function relogin(username: string, password: string) {
    return auth.login(username, password)
  }

  function resendEmailOTP() {
    return auth.resendEmailOTP()
  }

  function loginWithSavedCredential(userId: string) {
    return auth.loginWithSavedCredential(userId)
  }

  function verifyTOTP(codes: number[]) {
    return auth.verifyTOTP(codes.join(''))
  }

  function verifyEmailOTP(codes: number[]) {
    return auth.verifyEmailOTP(codes.join(''))
  }

  function verifyRecoveryOTP(codes: string[]) {
    return auth.verifyRecoveryOTP(codes.join(''))
  }

  return {
    saveCredentials,
    relogin,
    resendEmailOTP,
    login,
    loginWithSavedCredential,
    verifyTOTP,
    verifyEmailOTP,
    verifyRecoveryOTP
  }
}
