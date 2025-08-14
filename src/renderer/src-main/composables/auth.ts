import { onMounted, onUnmounted, ref } from 'vue'
import { useModule } from '@renderer/shared/hooks/use-module'
import type { ResponseErrorReason } from '@shared/types/vrchat-api-status'
import type { VRChatAuthentication } from '@renderer/shared/modules/vrchat-authentication'
import type {
  AuthenticationCredentialEntity,
  AuthenticationResumeSessionState,
  AuthenticationState,
  AuthenticationUserOverview
} from '@shared/types/vrchat-authentication'

export type AuthFormType =
  | 'credentials'
  | 'savedCredentials'
  | 'reauthenticate'
  | '2faAuthenticator'
  | '2faRecovery'
  | '2faEmail'

export interface AuthEvents {
  onCredentialError?: (error: ResponseErrorReason) => void
  onReauthenticateRequest?: (error: ResponseErrorReason) => void
  on2FAError?: (error: ResponseErrorReason) => void
}

function getInitialForm(
  state: AuthenticationState,
  credentials: AuthenticationCredentialEntity[]
): {
  overview: AuthenticationUserOverview | null
  type: AuthFormType
  recoveryAvailable: boolean
} {
  let overview: AuthenticationUserOverview | null = null
  let type: AuthFormType = 'credentials'
  let recoveryAvailable = false

  switch (state.type) {
    case 'twofa-required':
    case 'twofa-verifying': {
      const method = state.twoFactorAuthMethods[0]
      switch (method) {
        case 'emailOtp': {
          type = '2faEmail'
          break
        }
        case 'otp': {
          type = '2faRecovery'
          break
        }
        case 'totp': {
          type = '2faAuthenticator'
          break
        }
      }

      recoveryAvailable = state.twoFactorAuthMethods.includes('otp')
      break
    }
    default: {
      type = credentials.length > 0 ? 'savedCredentials' : 'credentials'
    }
  }

  switch (state.type) {
    case 'authenticating':
    case 'error':
    case 'twofa-required':
    case 'twofa-verifying': {
      overview = state.overview
      break
    }
  }

  return {
    type,
    overview,
    recoveryAvailable
  }
}

export function useAuth(events: AuthEvents = {}) {
  const auth = useModule<VRChatAuthentication>('VRChatAuthentication')

  const latestState = ref<AuthenticationState>(auth.state.value)
  const recoveryCodeAvailable = ref(false)
  const isInitializing = ref(true)
  const isLoading = ref(false)

  const savedCredentials = ref<AuthenticationCredentialEntity[]>([])
  const resumeSession = ref<AuthenticationResumeSessionState>({
    loggedIn: false,
    loggedInUserId: ''
  })

  const currentFormType = ref<AuthFormType>('credentials')
  const currentOverview = ref<AuthenticationUserOverview>({
    username: '',
    displayName: ''
  })

  const handleStateUpdate = (state: AuthenticationState) => {
    switch (state.type) {
      case 'authenticated':
      case 'authenticating':
      case 'twofa-verifying':
      case 'logging-out': {
        isLoading.value = true
        break
      }
      default: {
        isLoading.value = false
      }
    }

    switch (state.type) {
      case 'error': {
        switch (currentFormType.value) {
          case 'savedCredentials': {
            currentOverview.value = state.overview
            currentFormType.value = 'reauthenticate'
            events.onReauthenticateRequest?.(state.error)
            break
          }
          case 'credentials':
          case 'reauthenticate': {
            events.onCredentialError?.(state.error)
            break
          }
        }

        break
      }
      case 'twofa-required': {
        const method = state.twoFactorAuthMethods[0]
        switch (method) {
          case 'emailOtp': {
            currentFormType.value = '2faEmail'
            break
          }
          case 'otp': {
            currentFormType.value = '2faRecovery'
            break
          }
          case 'totp': {
            currentFormType.value = '2faAuthenticator'
            break
          }
        }

        if (latestState.value.type === 'twofa-verifying') {
          events.on2FAError?.(state.error!)
        }

        recoveryCodeAvailable.value = state.twoFactorAuthMethods.includes('otp')
        break
      }
    }

    switch (state.type) {
      case 'authenticating':
      case 'error':
      case 'twofa-required':
      case 'twofa-verifying': {
        currentOverview.value = state.overview
        break
      }
    }

    latestState.value = state
  }

  switch (auth.state.value.type) {
    case 'authenticating':
    case 'twofa-verifying': {
      isLoading.value = true
      break
    }
    default: {
      isLoading.value = false
    }
  }

  function deleteSavedCredential(userId: string) {
    auth.deleteCredential(userId)
    savedCredentials.value = savedCredentials.value.filter((cred) => cred.userId !== userId)
    if (savedCredentials.value.length === 0) {
      currentFormType.value = 'credentials'
    }
  }

  function backFromTwoFactorAuth() {
    if (currentFormType.value === '2faAuthenticator' || currentFormType.value === '2faEmail') {
      currentFormType.value = savedCredentials.value.length > 0 ? 'savedCredentials' : 'credentials'
      auth.logout()
    }
  }

  function backToAuthenticatorFromRecovery() {
    if (currentFormType.value === '2faRecovery') {
      currentFormType.value = '2faAuthenticator'
    }
  }

  function backFromReauthenticate() {
    if (currentFormType.value === 'reauthenticate') {
      currentFormType.value = 'savedCredentials'
    }
  }

  function changeToSaveCredentials() {
    if (currentFormType.value === 'credentials') {
      currentFormType.value = 'savedCredentials'
    }
  }

  function changeToCredentials() {
    if (currentFormType.value === 'savedCredentials') {
      currentFormType.value = 'credentials'
    }
  }

  function changeToUseRecoveryCode() {
    if (currentFormType.value === '2faAuthenticator') {
      currentFormType.value = '2faRecovery'
    }
  }

  onMounted(() => {
    auth.addListener('state:update', handleStateUpdate)

    Promise.all([auth.getResumeSessionState(), auth.getAllCredentials()])
      .then(([session, credentials]) => {
        savedCredentials.value = credentials
        resumeSession.value = session
      })
      .finally(() => {
        const { type, overview, recoveryAvailable } = getInitialForm(
          auth.state.value,
          savedCredentials.value
        )

        currentOverview.value = overview || currentOverview.value
        currentFormType.value = type
        recoveryCodeAvailable.value = recoveryAvailable
        isInitializing.value = false
      })
  })

  onUnmounted(() => {
    auth.removeListener('state:update', handleStateUpdate)
  })

  return {
    auth,
    latestState,
    isInitializing,
    isLoading,
    savedCredentials,
    resumeSession,
    recoveryCodeAvailable,
    currentFormType,
    currentOverview,
    deleteSavedCredential,
    backToAuthenticatorFromRecovery,
    backFromTwoFactorAuth,
    backFromReauthenticate,
    changeToSaveCredentials,
    changeToCredentials,
    changeToUseRecoveryCode
  }
}
