<script setup lang="ts">
import { useAuth } from '../composables/auth'
import { useAuthSubmit } from '../composables/auth-submit'
import { Spinner } from '@renderer/shared/components/ui/spinner'
import {
  AuthFormCredentials,
  AuthFormSavedCredentials,
  AuthFormReauthenticate,
  AuthForm2FAAuthenticator,
  AuthForm2FARecovery,
  AuthForm2FAEmail
} from '../components/auth-form'

const {
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
} = useAuth({
  onCredentialError(error) {
    console.error('Credential error:', error)
  },
  on2FAError(error) {
    console.error('2FA error:', error)
  }
})

const {
  login,
  loginWithSavedCredential,
  relogin,
  resendEmailOTP,
  verifyTOTP,
  verifyEmailOTP,
  verifyRecoveryOTP
} = useAuthSubmit()
</script>

<template>
  <div class="relative flex flex-row w-full h-full">
    <div class="relative flex-1 bg-black/20 flex items-center justify-center">
      <Spinner class="size-32" />
    </div>
    <div v-if="!isInitializing" class="relative flex-1 flex items-center justify-center">
      <AuthFormCredentials
        v-if="currentFormType === 'credentials'"
        :loading="isLoading"
        :saved-credentials-available="savedCredentials.length > 0"
        @change-to-save-credentials="changeToSaveCredentials"
        @submit="(values) => login(values.username, values.password, values.saveCredential)"
      />
      <AuthFormSavedCredentials
        v-else-if="currentFormType === 'savedCredentials'"
        :loading="isLoading"
        :items="savedCredentials"
        :default-user-id="resumeSession.loggedInUserId"
        @change-to-credentials="changeToCredentials"
        @delete-credential="deleteSavedCredential"
        @submit="(values) => loginWithSavedCredential(values.userId)"
      />
      <AuthFormReauthenticate
        v-else-if="currentFormType === 'reauthenticate'"
        :loading="isLoading"
        :overview="currentOverview"
        @back="backFromReauthenticate"
        @submit="(values) => relogin(values.username, values.password)"
      />
      <AuthForm2FAAuthenticator
        v-else-if="currentFormType === '2faAuthenticator'"
        :loading="isLoading"
        :overview="currentOverview"
        :recovery-available="recoveryCodeAvailable"
        @back="backFromTwoFactorAuth"
        @change-to-use-recovery-code="changeToUseRecoveryCode"
        @submit="(values) => verifyTOTP(values.code)"
      />
      <AuthForm2FARecovery
        v-else-if="currentFormType === '2faRecovery'"
        :loading="isLoading"
        :overview="currentOverview"
        @back="backToAuthenticatorFromRecovery"
        @submit="(values) => verifyRecoveryOTP(values.code)"
      />
      <AuthForm2FAEmail
        v-else-if="currentFormType === '2faEmail'"
        :loading="isLoading"
        :overview="currentOverview"
        @back="backFromTwoFactorAuth"
        @resend-email-otp="resendEmailOTP"
        @submit="(values) => verifyEmailOTP(values.code)"
      />
    </div>
  </div>
</template>
