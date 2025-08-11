import { useModule } from '@renderer/shared/hooks/use-module'
import type { VRChatAuthentication } from '@renderer/shared/modules/vrchat-authentication'

export function useAuthSubmit() {
  const auth = useModule<VRChatAuthentication>('VRChatAuthentication')

  function login(username: string, password: string, saveCredential: boolean) {
    console.log(saveCredential)
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
    relogin,
    resendEmailOTP,
    login,
    loginWithSavedCredential,
    verifyTOTP,
    verifyEmailOTP,
    verifyRecoveryOTP
  }
}
